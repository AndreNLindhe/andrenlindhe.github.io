/* Övningsbanan inför prov 2 – motorn.

   Nivåerna ligger i egna filer (nivaer-*.js) som anropar Ovningsbana.lagg().
   Motorn ritar en nivå i två iframe-fönster, Målbild och Ditt resultat, och rättar
   medan eleven skriver. En nivå är klar när två saker stämmer:

     1. Utseendet: elementen i jamfor ligger på samma plats, har samma storlek och
        samma beräknade värden för egenskaperna i stilar – i båda fönstren.
     2. Egenskapen: elevens CSS använder det nivån övar (krav). Rätt utseende med
        fel egenskap ger en ledtråd, inte godkänt.

   Nivåformat:
     id         fast och unikt – framstegen sparas under det, byts aldrig
     rubrik     kort rubrik
     typ        "andra" (ändra i färdig kod) eller "skriv" (skriv själv)
     forklaring HTML
     html       scenens innehåll, samma i båda fönstren
     bas        dold scen-CSS; får inte innehålla det nivån övar
     fore, efter  låst kod före och efter rutan
     start      rutans innehåll från början
     losning    rutans innehåll som löser nivån – ger målbilden
     jamfor     valfri, standard "body *"
     stilar     valfri lista med egenskaper som också jämförs
     krav       lista: { pa, egenskap, varde? } | { pa, selektor } | { text }, alla
                med valfri ledtrad (HTML)
     felvag     valfri: samma utseende utan kravet (används av självtestet)
     visaHtml   valfri, standard typ === "skriv" */

(function () {
  "use strict";

  var AVSNITT = [
    ["selektorer", "Selektorer"],
    ["boxmodellen", "Boxmodellen"],
    ["farg", "Färg"],
    ["typografi", "Typografi"],
    ["flexbox", "Flexbox"],
    ["variabler", "Variabler"],
    ["blandat", "Blandat"]
  ];
  var NYCKEL = "ovningsbana-webb1-omrade3";
  var VISA_LOSNING_EFTER_MS = 90000;
  var TOLERANS = 1;
  var VANTA_MS = 150;
  var MAX_HOJD = 600;
  var GRUND =
    "html { color-scheme: light; }\n" +
    "body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; background: #fff; color: #222; }\n";

  var TEXT = {
    klar: "Klart. Resultatet stämmer med målbilden.",
    sista: "Klart. Det var sista nivån i banan.",
    inteAn: "Inte än. Jämför ditt resultat med målbilden.",
    ledtrad: "Det ser rätt ut, men lös det på det sätt som instruktionen säger."
  };

  var register = {};

  function lagg(avsnitt, lista) {
    (register[avsnitt] = register[avsnitt] || []).push.apply(register[avsnitt], lista);
  }

  function nivaer() {
    var ut = [];
    AVSNITT.forEach(function (a) {
      (register[a[0]] || []).forEach(function (n) { n.avsnitt = a[0]; ut.push(n); });
    });
    return ut;
  }

  function hitta(id) {
    return nivaer().filter(function (n) { return n.id === id; })[0] || null;
  }

  function avsnittsnamn(nyckel) {
    return AVSNITT.filter(function (a) { return a[0] === nyckel; })[0][1];
  }

  /* ---------------- Scenens HTML som eleven läser ----------------
     Nivåerna skriver scenen på en rad. Eleven ska läsa den som kursens egen kod:
     två mellanslag per nivå, ett element som bara innehåller text och
     textelement på en rad, och element som innehåller andra element uppdelade. */

  var TOMMA = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/;
  var I_TEXT = /^(a|abbr|b|br|button|code|em|i|img|input|kbd|label|mark|q|s|select|small|span|strong|sub|sup|textarea|time|u)$/;
  var SANT_FALSKT = /^(async|autofocus|checked|defer|disabled|hidden|multiple|novalidate|open|readonly|required|selected)$/;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escAttr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }

  function startTagg(el) {
    var namn = el.tagName.toLowerCase();
    return "<" + namn + Array.prototype.map.call(el.attributes, function (a) {
      return " " + a.name + (a.value === "" && SANT_FALSKT.test(a.name) ? "" : "=\"" + escAttr(a.value) + "\"");
    }).join("") + ">";
  }

  function paRad(nod) {
    if (nod.nodeType === 3) { return esc(nod.textContent.replace(/\s+/g, " ")); }
    if (nod.nodeType !== 1) { return ""; }
    var namn = nod.tagName.toLowerCase();
    if (TOMMA.test(namn)) { return startTagg(nod); }
    return startTagg(nod) + Array.prototype.map.call(nod.childNodes, paRad).join("") + "</" + namn + ">";
  }

  function baraText(el) {
    return Array.prototype.every.call(el.children, function (barn) {
      return I_TEXT.test(barn.tagName.toLowerCase()) && baraText(barn);
    });
  }

  /* En rad: allt i elementet är text eller textelement, och det är antingen en
     mening (<p>Ring <a>oss</a></p>) eller högst ett element (<li><a>Hem</a></li>).
     Tre länkar i en nav utan text emellan blir tre rader. */
  function enRad(el) {
    if (!baraText(el)) { return false; }
    var harText = Array.prototype.some.call(el.childNodes, function (n) {
      return n.nodeType === 3 && n.textContent.trim();
    });
    return harText || el.children.length <= 1;
  }

  /* Kodrutan rymmer ungefär 46 tecken i bred skärm. Längre text bryts mellan orden,
     aldrig inne i en tagg – blanksteg och radbrytning betyder samma sak i HTML. */
  var BRED = 44;
  var BEVARA = /^(pre|textarea)$/;

  function radbryt(s, indrag) {
    var ord = [], bit = "", iTagg = false;
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "<") { iTagg = true; } else if (c === ">") { iTagg = false; }
      if (c === " " && !iTagg) { if (bit) { ord.push(bit); } bit = ""; } else { bit += c; }
    }
    if (bit) { ord.push(bit); }
    var ut = [], rad = "";
    ord.forEach(function (o) {
      if (rad && indrag.length + rad.length + 1 + o.length > BRED) { ut.push(indrag + rad); rad = o; }
      else { rad = rad ? rad + " " + o : o; }
    });
    if (rad) { ut.push(indrag + rad); }
    return ut;
  }

  function nodRader(nod, djup) {
    var indrag = new Array(djup + 1).join("  ");
    if (nod.nodeType === 3) {
      var text = nod.textContent.replace(/\s+/g, " ").trim();
      return text ? radbryt(esc(text), indrag) : [];
    }
    if (nod.nodeType !== 1) { return []; }
    var namn = nod.tagName.toLowerCase();
    if (TOMMA.test(namn)) { return [indrag + paRad(nod)]; }
    if (enRad(nod)) {
      var rad = indrag + paRad(nod);
      if (rad.length <= BRED || BEVARA.test(namn)) { return [rad]; }
      var inuti = Array.prototype.map.call(nod.childNodes, paRad).join("").trim();
      return [indrag + startTagg(nod)].concat(radbryt(inuti, indrag + "  "), [indrag + "</" + namn + ">"]);
    }
    var ut = [indrag + startTagg(nod)];
    Array.prototype.forEach.call(nod.childNodes, function (barn) {
      ut.push.apply(ut, nodRader(barn, djup + 1));
    });
    ut.push(indrag + "</" + nod.tagName.toLowerCase() + ">");
    return ut;
  }

  function lasbarHtml(html) {
    var mall = document.createElement("template");
    mall.innerHTML = html;
    var ut = [];
    Array.prototype.forEach.call(mall.content.childNodes, function (nod) {
      ut.push.apply(ut, nodRader(nod, 0));
    });
    return ut.join("\n");
  }

  /* ---------------- Lagring ----------------
     localStorage fungerar inte överallt (privat läge, vissa filsökvägar). Då
     fungerar banan ändå, den minns bara ingenting. */

  function las() {
    var data;
    try { data = JSON.parse(localStorage.getItem(NYCKEL) || "{}"); } catch (e) { data = {}; }
    data.klara = data.klara || {};
    data.utkast = data.utkast || {};
    return data;
  }

  function skriv(data) {
    try { localStorage.setItem(NYCKEL, JSON.stringify(data)); } catch (e) { /* ingen lagring */ }
  }

  /* ---------------- Fönstren ---------------- */

  function dokument(n) {
    return "<!doctype html><html lang=\"sv\"><head><meta charset=\"utf-8\"><title>Scen</title>" +
      "<style>" + GRUND + (n.bas || "") + "</style><style id=\"elev\"></style></head>" +
      "<body>" + n.html + "</body></html>";
  }

  /* Scenerna är bilder, inte sidor. En länk eller ett formulär i dem skulle
     annars ladda om fönstret – med hela övningsbanan i, eftersom ett
     srcdoc-dokument har sidans adress som bas – och rättningen går sönder. */
  function stang(doc) {
    doc.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) { e.preventDefault(); }
    });
    doc.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  function ladda(ram, n) {
    return new Promise(function (klar) {
      ram.onload = function () { ram.onload = null; stang(ram.contentDocument); klar(); };
      ram.srcdoc = dokument(n);
    });
  }

  function elevCss(n, text) { return (n.fore || "") + (text || "") + (n.efter || ""); }

  function sattCss(ram, css) { ram.contentDocument.getElementById("elev").textContent = css; }

  function hojd(ram) {
    var body = ram.contentDocument.body;
    return body ? Math.min(MAX_HOJD, Math.ceil(body.getBoundingClientRect().bottom)) : 0;
  }

  /* ---------------- Rättningen ---------------- */

  function matt(ram, n) {
    var doc = ram.contentDocument;
    var fonster = ram.contentWindow;
    var bas = doc.body.getBoundingClientRect();
    var element = doc.querySelectorAll(n.jamfor || "body *");
    return Array.prototype.map.call(element, function (el) {
      var r = el.getBoundingClientRect();
      var s = fonster.getComputedStyle(el);
      return {
        x: r.left - bas.left, y: r.top - bas.top, b: r.width, h: r.height,
        stil: (n.stilar || []).map(function (p) { return s.getPropertyValue(p); })
      };
    });
  }

  function lika(a, b) {
    if (a.length !== b.length) { return false; }
    return a.every(function (m, i) {
      var o = b[i];
      return Math.abs(m.x - o.x) <= TOLERANS && Math.abs(m.y - o.y) <= TOLERANS &&
        Math.abs(m.b - o.b) <= TOLERANS && Math.abs(m.h - o.h) <= TOLERANS &&
        m.stil.join("|") === o.stil.join("|");
    });
  }

  /* Elevens regler, även de som ligger inuti @media. Bara regler med selektor. */
  function regler(ram) {
    var ut = [];
    function samla(lista) {
      Array.prototype.forEach.call(lista, function (r) {
        if (r.selectorText !== undefined) { ut.push(r); }
        else if (r.cssRules) { samla(r.cssRules); }
      });
    }
    var blad = ram.contentDocument.getElementById("elev").sheet;
    try { samla(blad.cssRules); } catch (e) { /* tomt blad */ }
    return ut;
  }

  function traffar(ram, regel, pa) {
    try {
      return Array.prototype.some.call(ram.contentDocument.querySelectorAll(pa), function (el) {
        return el.matches(regel.selectorText);
      });
    } catch (e) { return false; }
  }

  /* Delegenskaperna till de kortformer som nivåerna kräver. padding-left räknas
     som padding och column-gap som gap – men flex-wrap är ingen del av flex. */
  var DELAR = {
    flex: ["flex-grow", "flex-shrink", "flex-basis"],
    gap: ["row-gap", "column-gap"],
    padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
    margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    background: ["background-color", "background-image"],
    border: ["border-top", "border-right", "border-bottom", "border-left",
      "border-width", "border-style", "border-color",
      "border-top-width", "border-top-style", "border-top-color"]
  };

  /* Satt egenskapen, direkt eller via en av sina delar. */
  function varde(regel, egenskap) {
    var v = regel.style.getPropertyValue(egenskap);
    if (v) { return v; }
    var delar = DELAR[egenskap] || [];
    for (var i = 0; i < delar.length; i++) {
      v = regel.style.getPropertyValue(delar[i]);
      if (v) { return v; }
    }
    return "";
  }

  function uppfyllt(ram, krav, css) {
    if (krav.text) { return krav.text.test(css); }
    return regler(ram).some(function (r) {
      if (!traffar(ram, r, krav.pa)) { return false; }
      if (krav.selektor) { return krav.selektor.test(r.selectorText); }
      var v = varde(r, krav.egenskap);
      return v !== "" && (!krav.varde || krav.varde.test(v));
    });
  }

  function ledtradFor(krav) {
    if (krav.ledtrad) { return krav.ledtrad; }
    if (krav.egenskap) {
      return "Det ser rätt ut, men nivån övar <code>" + krav.egenskap + "</code>. Prova att lösa det med den.";
    }
    return TEXT.ledtrad;
  }

  /* Rättar det som just nu står i elevfönstret mot målfönstret. */
  function ratta(n, mal, elev, text) {
    if (!lika(matt(mal, n), matt(elev, n))) { return { lage: "inte-an" }; }
    var css = elevCss(n, text);
    var saknas = n.krav.filter(function (k) { return !uppfyllt(elev, k, css); })[0];
    if (saknas) { return { lage: "ledtrad", ledtrad: ledtradFor(saknas) }; }
    return { lage: "klar" };
  }

  /* Dolda fönster för bedom(), så att självtestet inte rör sidan. */
  var provram = null;

  function skapaProvram() {
    if (provram) { return provram; }
    function ram() {
      var f = document.createElement("iframe");
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("tabindex", "-1");
      f.title = "Rättning";
      f.style.cssText = "position:absolute;left:-10000px;top:0;width:640px;height:400px;border:0;";
      document.body.appendChild(f);
      return f;
    }
    provram = { mal: ram(), elev: ram() };
    return provram;
  }

  /* bredd är fönstrens bredd i pixlar, standard 640. Självtestet provar även
     smala telefoner, där en scen kan se klar ut redan från början. */
  function bedom(id, text, bredd) {
    var n = hitta(id);
    if (!n) { return Promise.reject(new Error("okänd nivå " + id)); }
    var p = skapaProvram();
    p.mal.style.width = p.elev.style.width = (bredd || 640) + "px";
    return Promise.all([ladda(p.mal, n), ladda(p.elev, n)]).then(function () {
      sattCss(p.mal, elevCss(n, n.losning));
      sattCss(p.elev, elevCss(n, text));
      return ratta(n, p.mal, p.elev, text);
    });
  }

  /* ---------------- Sidan ---------------- */

  function starta() {
    var $ = function (id) { return document.getElementById(id); };
    var karta = $("ob-karta");
    var plats = $("ob-plats");
    var rubrik = $("ob-rubrik");
    var forklaring = $("ob-forklaring");
    var fore = $("ob-fore");
    var efter = $("ob-efter");
    var ruta = $("ob-text");
    var status = $("ob-status");
    var forra = $("ob-forra");
    var nasta = $("ob-nasta");
    var visa = $("ob-visa");
    var omstart = $("ob-omstart");
    var losning = $("ob-losning");
    var losningskod = $("ob-losningskod");
    var htmlruta = $("ob-html");
    var htmlkod = $("ob-htmlkod");
    var mal = $("ob-mal");
    var elev = $("ob-elev");

    var alla = nivaer();
    if (!alla.length || !karta) { return; }

    var data = las();
    var aktuell = null;
    var omgang = 0;
    var vantar = null;
    var timer = null;

    function index(n) { return alla.indexOf(n); }

    function ritaKarta() {
      karta.textContent = "";
      AVSNITT.forEach(function (a) {
        var egna = alla.filter(function (n) { return n.avsnitt === a[0]; });
        if (!egna.length) { return; }
        var grupp = document.createElement("div");
        grupp.className = "ob-grupp";
        var namn = document.createElement("span");
        namn.textContent = a[1];
        var lista = document.createElement("ol");
        egna.forEach(function (n) {
          var li = document.createElement("li");
          var lank = document.createElement("a");
          var nr = index(n) + 1;
          lank.href = "#" + n.id;
          lank.className = "ob-prick" + (data.klara[n.id] ? " ob-klar" : "");
          lank.textContent = nr;
          lank.setAttribute("aria-label", "Nivå " + nr + ": " + n.rubrik + (data.klara[n.id] ? ", klar" : ""));
          if (n === aktuell) { lank.setAttribute("aria-current", "step"); }
          li.appendChild(lank);
          lista.appendChild(li);
        });
        grupp.appendChild(namn);
        grupp.appendChild(lista);
        karta.appendChild(grupp);
      });
    }

    function anpassaRuta() {
      ruta.rows = Math.max(3, ruta.value.split("\n").length + 1);
    }

    function anpassaHojd() {
      var h = Math.max(hojd(mal), hojd(elev), 60) + "px";
      mal.style.height = h;
      elev.style.height = h;
    }

    function visaStatus(svar) {
      var sista = index(aktuell) === alla.length - 1;
      status.className = "ob-status ob-" + svar.lage;
      if (svar.lage === "klar") { status.textContent = sista ? TEXT.sista : TEXT.klar; }
      else if (svar.lage === "ledtrad") { status.innerHTML = svar.ledtrad; }
      else { status.textContent = TEXT.inteAn; }
    }

    function uppdateraKnappar() {
      var i = index(aktuell);
      forra.disabled = i === 0;
      nasta.disabled = !data.klara[aktuell.id] || i === alla.length - 1;
    }

    function rattaNu() {
      var n = aktuell;
      sattCss(elev, elevCss(n, ruta.value));
      anpassaHojd();
      var svar = ratta(n, mal, elev, ruta.value);
      visaStatus(svar);
      if (svar.lage === "klar" && !data.klara[n.id]) {
        data.klara[n.id] = true;
        skriv(data);
        ritaKarta();
      }
      if (svar.lage === "klar") { clearTimeout(timer); }
      uppdateraKnappar();
    }

    function visaNiva(n) {
      var denna = ++omgang;
      aktuell = n;
      data.senast = n.id;
      skriv(data);
      clearTimeout(timer);

      plats.textContent = avsnittsnamn(n.avsnitt) + " · nivå " + (index(n) + 1) + " av " + alla.length;
      rubrik.textContent = n.rubrik;
      forklaring.innerHTML = n.forklaring;
      fore.textContent = n.fore || "";
      efter.textContent = n.efter || "";
      ruta.value = data.utkast[n.id] !== undefined ? data.utkast[n.id] : n.start;
      anpassaRuta();
      status.textContent = "";
      status.className = "ob-status";

      losning.hidden = true;
      losningskod.textContent = elevCss(n, n.losning);
      visa.hidden = true;
      if (!data.klara[n.id]) {
        timer = setTimeout(function () { visa.hidden = false; }, VISA_LOSNING_EFTER_MS);
      }

      var html = n.visaHtml !== undefined ? n.visaHtml : n.typ === "skriv";
      htmlruta.hidden = !html;
      htmlkod.textContent = html ? lasbarHtml(n.html) : "";

      ritaKarta();
      uppdateraKnappar();

      Promise.all([ladda(mal, n), ladda(elev, n)]).then(function () {
        if (denna !== omgang) { return; }
        sattCss(mal, elevCss(n, n.losning));
        rattaNu();
      });
    }

    function franAdress() {
      var n = hitta(location.hash.slice(1));
      if (!n) {
        n = hitta(data.senast) ||
          alla.filter(function (m) { return !data.klara[m.id]; })[0] || alla[0];
        /* Adressen visar nivån, men får det inte göras startar banan ändå. */
        try { history.replaceState(null, "", "#" + n.id); } catch (e) { /* ingen historik */ }
      }
      visaNiva(n);
    }

    function ga(steg) {
      var n = alla[index(aktuell) + steg];
      if (!n) { return; }
      location.hash = "#" + n.id;
      rubrik.focus();
    }

    ruta.addEventListener("input", function () {
      data.utkast[aktuell.id] = ruta.value;
      skriv(data);
      anpassaRuta();
      clearTimeout(vantar);
      vantar = setTimeout(rattaNu, VANTA_MS);
    });

    forra.addEventListener("click", function () { ga(-1); });
    nasta.addEventListener("click", function () { ga(1); });
    visa.addEventListener("click", function () { losning.hidden = false; visa.hidden = true; });
    omstart.addEventListener("click", function () {
      ruta.value = aktuell.start;
      delete data.utkast[aktuell.id];
      skriv(data);
      anpassaRuta();
      rattaNu();
      ruta.focus();
    });
    window.addEventListener("hashchange", franAdress);

    franAdress();
  }

  window.Ovningsbana = { lagg: lagg, nivaer: nivaer, bedom: bedom, lasbarHtml: lasbarHtml };

  document.addEventListener("DOMContentLoaded", starta);
})();
