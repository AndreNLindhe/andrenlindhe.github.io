/* Övningsbanan – motorn.

   Nivåerna ligger i egna filer (nivaer-*.js) som anropar
   Ovningsbana.lagg(avsnitt, lista, namn). Avsnitten står i kartan i den ordning
   de läggs till. Motorn ritar en nivå i två iframe-fönster, Målbild och Ditt
   resultat, och rättar elevens kod mot nivåns lösning. En nivå är klar när två
   saker stämmer:

     1. Resultatet: elementen i jamfor ligger på samma plats, har samma storlek och
        samma beräknade värden för egenskaperna i stilar – i båda fönstren. För
        utskriftsnivåer: samma rader i konsolen.
     2. Sättet: elevens kod använder det nivån övar (krav). Rätt resultat på fel
        sätt ger en ledtråd, inte godkänt.

   Tre språk (sprak):
     "css"   eleven skriver CSS till en fast scen (html). Rättas medan hen skriver.
     "html"  eleven skriver scenens HTML; bas ger den dolda stilen. Rättas medan
             hen skriver. Skript i elevens HTML körs inte.
     "js"    eleven skriver JavaScript till en fast scen. Körs först på Kör koden
             eller Ctrl+Enter – en oändlig loop ska inte låsa fliken medan någon
             skriver. Varje provsekvens körs i ett nyladdat fönster.

   Nivåformat (hela beskrivningen finns i skillens references/nivaformat.md):
     id          fast och unikt – framstegen sparas under det, byts aldrig
     sprak       "css" (standard), "html" eller "js"
     rubrik, typ ("andra" eller "skriv"), forklaring (HTML)
     html        scenens innehåll (css, js)
     bas         dold scen-CSS; får inte innehålla det nivån övar
     fore, efter låst kod före och efter rutan
     start       rutans innehåll från början
     losning     rutans innehåll som löser nivån – ger målbilden
     jamfor      valfri, standard "body *"
     stilar      valfri lista med egenskaper som också jämförs
     texter      valfri: jämför också text och värden (standard för js)
     utseende    false: rätta bara kraven, inte utseendet (html)
     prov        js: lista med sekvenser av steg – {klicka}, {skriv: [selektor, värde]},
                 {skicka: formulär}, {vanta: ms}. Standard [[]], en körning utan steg
     visa        js: vilken sekvens de synliga fönstren visar, standard den sista
     utskrift    js: true jämför console.log-raderna
     krav        lista: { pa, egenskap, varde? } | { pa, selektor } | { text } |
                 { finns }, alla med valfri ledtrad (HTML)
     felvag      valfri sträng eller lista: samma resultat utan kravet (självtestet)
     visaHtml    valfri: visa scenens HTML under rutan */

(function () {
  "use strict";

  var VISA_LOSNING_EFTER_MS = 90000;
  var TOLERANS = 1;
  var VANTA_MS = 150;
  var BILD_MS = 1000;
  var MAX_HOJD = 600;
  var GRUND =
    "html { color-scheme: light; }\n" +
    "body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; background: #fff; color: #222; }\n" +
    "#ob-konsol { margin: 0; font: 0.9rem/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; }\n";

  var TEXT = {
    klar: "Klart. Resultatet stämmer med målbilden.",
    sista: "Klart. Det var sista nivån i banan.",
    inteAn: "Inte än. Jämför ditt resultat med målbilden.",
    ledtrad: "Det ser rätt ut, men lös det på det sätt som instruktionen säger.",
    kor: "Skriv koden och tryck Kör koden, eller Ctrl+Enter.",
    kors: "Koden körs.",
    fel: "Fel i koden"
  };
  var ETIKETT = { css: "Din CSS", html: "Din HTML", js: "Ditt JavaScript" };

  var register = {};
  var ordning = [];
  var namn = {};

  function lagg(avsnitt, lista, rubrik) {
    if (!register[avsnitt]) { register[avsnitt] = []; ordning.push(avsnitt); }
    if (rubrik) { namn[avsnitt] = rubrik; }
    register[avsnitt].push.apply(register[avsnitt], lista);
  }

  function nivaer() {
    var ut = [];
    ordning.forEach(function (a) {
      register[a].forEach(function (n) { n.avsnitt = a; ut.push(n); });
    });
    return ut;
  }

  function hitta(id) {
    return nivaer().filter(function (n) { return n.id === id; })[0] || null;
  }

  function avsnittsnamn(nyckel) {
    return namn[nyckel] || nyckel.charAt(0).toUpperCase() + nyckel.slice(1);
  }

  function sprak(n) { return n.sprak || "css"; }

  function vanta(ms) { return new Promise(function (klar) { setTimeout(klar, ms); }); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function rader(s) { return s ? s.split("\n").length - 1 : 0; }

  /* ---------------- Lagring ----------------
     localStorage fungerar inte överallt (privat läge, vissa filsökvägar). Då
     fungerar banan ändå, den minns bara ingenting. */

  var nyckel = "ovningsbana";

  function las() {
    var data = null;
    try { data = JSON.parse(localStorage.getItem(nyckel) || "{}"); } catch (e) { /* trasigt */ }
    if (!data || typeof data !== "object") { data = {}; }
    data.klara = data.klara || {};
    data.utkast = data.utkast || {};
    return data;
  }

  function skriv(data) {
    try { localStorage.setItem(nyckel, JSON.stringify(data)); } catch (e) { /* ingen lagring */ }
  }

  /* ---------------- Fönstren ---------------- */

  function dokument(n) {
    return "<!doctype html><html lang=\"sv\"><head><meta charset=\"utf-8\"><title>Scen</title>" +
      "<style>" + GRUND + (n.bas || "") + "</style><style id=\"elev\"></style></head>" +
      "<body>" + (sprak(n) === "html" ? "" : n.html || "") + "</body></html>";
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

  function kodFor(n, text) { return (n.fore || "") + (text || "") + (n.efter || ""); }

  /* CSS läggs i elevens stilblad, HTML blir scenens innehåll. innerHTML kör inga
     skript, så en script-tagg i elevens HTML gör ingenting. */
  function satt(ram, n, text) {
    var doc = ram.contentDocument;
    if (sprak(n) === "html") { doc.body.innerHTML = kodFor(n, text); }
    else { doc.getElementById("elev").textContent = kodFor(n, text); }
  }

  /* Bilder utan angiven storlek flyttar om sidan när de laddats. Rätta efter. */
  function bilder(doc) {
    var vantande = Array.prototype.filter.call(doc.images, function (b) { return !b.complete; });
    if (!vantande.length) { return Promise.resolve(); }
    return Promise.race([
      Promise.all(vantande.map(function (b) {
        return new Promise(function (klar) {
          b.addEventListener("load", klar);
          b.addEventListener("error", klar);
        });
      })),
      vanta(BILD_MS)
    ]);
  }

  function hojd(ram) {
    var body = ram.contentDocument && ram.contentDocument.body;
    return body ? Math.min(MAX_HOJD, Math.ceil(body.getBoundingClientRect().bottom)) : 0;
  }

  /* ---------------- Rättningen ---------------- */

  function matt(ram, n) {
    var doc = ram.contentDocument;
    var fonster = ram.contentWindow;
    var bas = doc.body.getBoundingClientRect();
    /* Skriptet som motorn lägger in i JavaScript-scenerna är olika i de två
       fönstren och syns inte. Det och stilblock jämförs aldrig. */
    var element = Array.prototype.filter.call(doc.querySelectorAll(n.jamfor || "body *"), function (el) {
      return el.tagName !== "SCRIPT" && el.tagName !== "STYLE";
    });
    var texter = n.texter !== undefined ? n.texter : sprak(n) === "js";
    return element.map(function (el) {
      var r = el.getBoundingClientRect();
      var s = fonster.getComputedStyle(el);
      return {
        x: r.left - bas.left, y: r.top - bas.top, b: r.width, h: r.height,
        stil: (n.stilar || []).map(function (p) { return s.getPropertyValue(p); }),
        t: texter ? el.textContent.replace(/\s+/g, " ").trim() + "|" + (el.value !== undefined ? el.value : "") : ""
      };
    });
  }

  function lika(a, b) {
    if (a.length !== b.length) { return false; }
    return a.every(function (m, i) {
      var o = b[i];
      return Math.abs(m.x - o.x) <= TOLERANS && Math.abs(m.y - o.y) <= TOLERANS &&
        Math.abs(m.b - o.b) <= TOLERANS && Math.abs(m.h - o.h) <= TOLERANS &&
        m.stil.join("|") === o.stil.join("|") && m.t === o.t;
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
    var blad = ram.contentDocument.getElementById("elev");
    try { samla(blad.sheet.cssRules); } catch (e) { /* tomt blad */ }
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

  /* Textkrav ska inte gå att uppfylla med en kommentar. */
  function utanKommentarer(n, kod) {
    if (sprak(n) === "html") { return kod.replace(/<!--[\s\S]*?-->/g, ""); }
    kod = kod.replace(/\/\*[\s\S]*?\*\//g, "");
    if (sprak(n) === "js") { kod = kod.replace(/(^|[^:"'\\])\/\/.*$/gm, "$1"); }
    return kod;
  }

  function uppfyllt(ram, krav, kod) {
    if (krav.text) { return krav.text.test(kod); }
    if (krav.finns) {
      try { return !!ram.contentDocument.querySelector(krav.finns); } catch (e) { return false; }
    }
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
      return "Det ser rätt ut, men nivån övar <code>" + esc(krav.egenskap) + "</code>. Prova att lösa det med den.";
    }
    if (krav.finns) {
      return "Det ser rätt ut, men koden ska innehålla <code>" + esc(krav.finns) + "</code>.";
    }
    return TEXT.ledtrad;
  }

  function kravSvar(n, ram, text) {
    var kod = utanKommentarer(n, kodFor(n, text));
    var saknas = n.krav.filter(function (k) { return !uppfyllt(ram, k, kod); })[0];
    return saknas ? { lage: "ledtrad", ledtrad: ledtradFor(saknas) } : { lage: "klar" };
  }

  /* CSS och HTML: rättar det som just nu står i elevfönstret mot målfönstret. */
  function ratta(n, mal, elev, text) {
    if (n.utseende !== false && !lika(matt(mal, n), matt(elev, n))) { return { lage: "inte-an" }; }
    return kravSvar(n, elev, text);
  }

  /* ---------------- JavaScript ---------------- */

  function formatera(v) {
    if (typeof v === "string") { return v; }
    if (v && typeof v === "object") {
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  }

  function ettSteg(w, doc, s) {
    if (s.vanta) { return vanta(s.vanta); }
    var el = doc.querySelector(s.klicka || s.skicka || (s.skriv && s.skriv[0]) || null);
    if (!el) { return; }
    if (s.klicka) { el.click(); }
    else if (s.skicka) { el.requestSubmit(); }
    else {
      el.value = s.skriv[1];
      el.dispatchEvent(new w.Event("input", { bubbles: true }));
      el.dispatchEvent(new w.Event("change", { bubbles: true }));
    }
  }

  /* Laddar scenen, kör koden och sedan stegen. Svaret är det första felet (om
     något) och raderna som skrevs ut. alert, confirm och prompt skulle låsa
     sidan, så de skriver ut i stället. tyst: skriv inte till webbläsarens konsol. */
  function korJs(ram, n, text, steg, tyst) {
    return ladda(ram, n).then(function () {
      var w = ram.contentWindow;
      var doc = ram.contentDocument;
      var ut = { fel: null, rader: [] };
      w.addEventListener("error", function (e) {
        if (!ut.fel) { ut.fel = { text: e.message, rad: e.lineno }; }
        e.preventDefault();
      });
      w.addEventListener("unhandledrejection", function (e) {
        if (!ut.fel) { ut.fel = { text: String(e.reason && e.reason.message || e.reason), rad: 0 }; }
        e.preventDefault();
      });
      var logg = w.console.log;
      function skrivUt() {
        ut.rader.push(Array.prototype.map.call(arguments, formatera).join(" "));
        if (!tyst) { logg.apply(w.console, arguments); }
      }
      w.console.log = skrivUt;
      w.alert = skrivUt;
      w.confirm = function (t) { skrivUt(t); return true; };
      w.prompt = function (t) { skrivUt(t); return ""; };

      var skript = doc.createElement("script");
      skript.textContent = kodFor(n, text);
      doc.body.appendChild(skript);

      return (steg || []).reduce(function (p, s) {
        return p.then(function () { return ettSteg(w, doc, s); });
      }, Promise.resolve()).then(function () { return vanta(0); }).then(function () { return ut; });
    });
  }

  function beskrivFel(n, fel) {
    /* Syntaxfel kommer som "Failed to execute 'appendChild' …: Unexpected …" –
       motorns anrop, inte elevens. Bara själva felet visas. */
    var text = String(fel.text || "okänt fel")
      .replace(/^Uncaught\s+/, "")
      .replace(/Failed to execute '[^']*' on '[^']*':\s*/, "");
    var rad = fel.rad - rader(n.fore);
    return TEXT.fel + (rad > 0 ? " på rad " + rad : "") + ": " + text;
  }

  function visaSteg(n) {
    var prov = n.prov || [[]];
    return prov[n.visa !== undefined ? n.visa : prov.length - 1];
  }

  /* Varje sekvens körs från en nyladdad scen, först lösningen och sedan elevens
     kod. Kraven prövas på elevens fönster efter sista sekvensen. */
  function rattaJs(n, text, mal, elev) {
    var sekvenser = n.prov || [[]];
    var i = 0;
    function nasta() {
      if (i === sekvenser.length) { return kravSvar(n, elev, text); }
      var steg = sekvenser[i++];
      return korJs(mal, n, n.losning, steg, true).then(function (m) {
        if (m.fel) { throw new Error("lösningen ger fel: " + m.fel.text); }
        return korJs(elev, n, text, steg, true).then(function (e) {
          if (e.fel) { return { lage: "fel", fel: beskrivFel(n, e.fel) }; }
          if (n.utskrift && m.rader.join("\n") !== e.rader.join("\n")) { return { lage: "inte-an" }; }
          if ((!n.utskrift || n.jamfor) && !lika(matt(mal, n), matt(elev, n))) { return { lage: "inte-an" }; }
          return nasta();
        });
      });
    }
    return nasta();
  }

  /* ---------------- Rättning utan sidan ----------------
     Dolda fönster för bedom(), så att självtestet och Kör koden inte rör de
     synliga. Anropen köas – fönstren delas. */

  var provram = null;
  var ko = Promise.resolve();

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
    var jobb = ko.then(function () {
      var p = skapaProvram();
      p.mal.style.width = p.elev.style.width = (bredd || 640) + "px";
      if (sprak(n) === "js") { return rattaJs(n, text, p.mal, p.elev); }
      return Promise.all([ladda(p.mal, n), ladda(p.elev, n)]).then(function () {
        satt(p.mal, n, n.losning);
        satt(p.elev, n, text);
        return Promise.all([bilder(p.mal.contentDocument), bilder(p.elev.contentDocument)]);
      }).then(function () { return ratta(n, p.mal, p.elev, text); });
    });
    ko = jobb.catch(function () { /* nästa jobb ska köra ändå */ });
    return jobb;
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
    var etikett = $("ob-etikett");
    var ruta = $("ob-text");
    var status = $("ob-status");
    var korknapp = $("ob-kor");
    var forra = $("ob-forra");
    var nasta = $("ob-nasta");
    var visa = $("ob-visa");
    var omstart = $("ob-omstart");
    var losning = $("ob-losning");
    var losningskod = $("ob-losningskod");
    var htmlruta = $("ob-html");
    var htmlkod = $("ob-htmlkod");
    var maltext = $("ob-maltext");
    var mal = $("ob-mal");
    var elev = $("ob-elev");

    nyckel = document.body.getAttribute("data-ob-nyckel") || "ovningsbana:" + location.pathname;
    var alla = nivaer();
    if (!alla.length || !karta) { return; }

    var data = las();
    var aktuell = null;
    var omgang = 0;
    var varv = 0;
    var vantar = null;
    var timer = null;

    function index(n) { return alla.indexOf(n); }

    function ritaKarta() {
      karta.textContent = "";
      ordning.forEach(function (a) {
        var egna = alla.filter(function (n) { return n.avsnitt === a; });
        var grupp = document.createElement("div");
        grupp.className = "ob-grupp";
        var rubriken = document.createElement("span");
        rubriken.textContent = avsnittsnamn(a);
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
        grupp.appendChild(rubriken);
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

    /* Scenen kan byta höjd efter att den mätts – ett klick, en bild, typsnitt som
       blir klara. Fönstren följer innehållet i stället för att mätas en gång. */
    function folj(ram) {
      var w = ram.contentWindow;
      if (!w || !w.ResizeObserver) { return; }
      new w.ResizeObserver(anpassaHojd).observe(ram.contentDocument.documentElement);
    }

    function visaStatus(svar) {
      var sista = index(aktuell) === alla.length - 1;
      status.className = "ob-status ob-" + svar.lage;
      if (svar.lage === "klar") { status.textContent = sista ? TEXT.sista : TEXT.klar; }
      else if (svar.lage === "ledtrad") { status.innerHTML = svar.ledtrad; }
      else if (svar.lage === "fel") { status.textContent = svar.fel; }
      else if (svar.lage === "vantar") { status.textContent = svar.text; }
      else { status.textContent = TEXT.inteAn; }
    }

    function uppdateraKnappar() {
      var i = index(aktuell);
      forra.disabled = i === 0;
      nasta.disabled = !data.klara[aktuell.id] || i === alla.length - 1;
    }

    function hantera(n, svar) {
      visaStatus(svar);
      if (svar.lage === "klar" && !data.klara[n.id]) {
        data.klara[n.id] = true;
        skriv(data);
        ritaKarta();
      }
      if (svar.lage === "klar") { clearTimeout(timer); }
      uppdateraKnappar();
    }

    /* CSS och HTML rättas i de synliga fönstren medan eleven skriver. */
    function rattaNu() {
      var n = aktuell;
      var detta = ++varv;
      var text = ruta.value;
      satt(elev, n, text);
      bilder(elev.contentDocument).then(function () {
        if (detta !== varv || n !== aktuell) { return; }
        anpassaHojd();
        hantera(n, ratta(n, mal, elev, text));
      });
    }

    function konsol(ram, rader) {
      var doc = ram.contentDocument;
      var pre = doc.createElement("pre");
      pre.id = "ob-konsol";
      pre.textContent = rader.join("\n");
      doc.body.appendChild(pre);
    }

    function korSynlig(ram, n, text, tyst) {
      return korJs(ram, n, text, visaSteg(n), tyst).then(function (ut) {
        if (n.utskrift) { konsol(ram, ut.rader); }
        folj(ram);
        anpassaHojd();
        return ut;
      });
    }

    function tomScen(n) {
      return ladda(elev, n).then(function () {
        if (n.utskrift) { konsol(elev, []); }
        folj(elev);
        anpassaHojd();
      });
    }

    /* JavaScript rättas i dolda fönster i samma bredd, och visas sedan här. */
    function korNu() {
      var n = aktuell;
      var denna = omgang;
      var text = ruta.value;
      korknapp.disabled = true;
      visaStatus({ lage: "vantar", text: TEXT.kors });
      bedom(n.id, text, elev.clientWidth || 640).then(function (svar) {
        if (denna !== omgang) { return; }
        return korSynlig(elev, n, text, false).then(function () {
          if (denna === omgang) { hantera(n, svar); }
        });
      }).catch(function (e) {
        if (denna === omgang) { visaStatus({ lage: "fel", fel: "Nivån går inte att rätta: " + e.message }); }
      }).then(function () { korknapp.disabled = false; });
    }

    function visaNiva(n) {
      var denna = ++omgang;
      var s = sprak(n);
      aktuell = n;
      data.senast = n.id;
      skriv(data);
      clearTimeout(timer);
      clearTimeout(vantar);

      plats.textContent = avsnittsnamn(n.avsnitt) + " · nivå " + (index(n) + 1) + " av " + alla.length;
      rubrik.textContent = n.rubrik;
      forklaring.innerHTML = n.forklaring;
      fore.textContent = n.fore || "";
      efter.textContent = n.efter || "";
      if (etikett) { etikett.textContent = ETIKETT[s]; }
      if (maltext) {
        var klickbar = s === "js" && (n.prov || []).some(function (q) { return q.length; });
        maltext.textContent = klickbar ? "Målbild – prova att klicka" : "Målbild";
      }
      if (korknapp) { korknapp.hidden = s !== "js"; korknapp.disabled = false; }
      ruta.value = data.utkast[n.id] !== undefined ? data.utkast[n.id] : n.start;
      anpassaRuta();
      status.textContent = "";
      status.className = "ob-status";

      losning.hidden = true;
      losningskod.textContent = kodFor(n, n.losning);
      visa.hidden = true;
      if (!data.klara[n.id]) {
        timer = setTimeout(function () { visa.hidden = false; }, VISA_LOSNING_EFTER_MS);
      }

      var html = n.visaHtml !== undefined ? n.visaHtml : s === "js" || (s === "css" && n.typ === "skriv");
      htmlruta.hidden = !html || !n.html;
      htmlkod.textContent = html && n.html ? n.html.replace(/></g, ">\n<") : "";

      ritaKarta();
      uppdateraKnappar();

      if (s === "js") {
        /* Ett sparat utkast körs aldrig av sig självt – är det en oändlig loop
           skulle sidan låsa sig varje gång den öppnas. */
        visaStatus({ lage: "vantar", text: TEXT.kor });
        korSynlig(mal, n, n.losning, true);
        tomScen(n);
        return;
      }

      Promise.all([ladda(mal, n), ladda(elev, n)]).then(function () {
        if (denna !== omgang) { return; }
        satt(mal, n, n.losning);
        folj(mal);
        folj(elev);
        return bilder(mal.contentDocument).then(function () {
          if (denna === omgang) { rattaNu(); }
        });
      });
    }

    function franAdress() {
      var id = location.hash.slice(1);
      var n = hitta(id);
      if (!n) {
        /* Ett okänt id ger första oklara nivån, ingen adress den senaste. */
        n = (id ? null : hitta(data.senast)) ||
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
      if (sprak(aktuell) === "js") { visaStatus({ lage: "vantar", text: TEXT.kor }); return; }
      vantar = setTimeout(rattaNu, VANTA_MS);
    });

    ruta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && sprak(aktuell) === "js") {
        e.preventDefault();
        if (!korknapp.disabled) { korNu(); }
      }
    });

    if (korknapp) { korknapp.addEventListener("click", korNu); }
    forra.addEventListener("click", function () { ga(-1); });
    nasta.addEventListener("click", function () { ga(1); });
    visa.addEventListener("click", function () { losning.hidden = false; visa.hidden = true; });
    omstart.addEventListener("click", function () {
      ruta.value = aktuell.start;
      delete data.utkast[aktuell.id];
      skriv(data);
      anpassaRuta();
      if (sprak(aktuell) === "js") {
        visaStatus({ lage: "vantar", text: TEXT.kor });
        tomScen(aktuell);
      } else {
        rattaNu();
      }
      ruta.focus();
    });
    window.addEventListener("hashchange", franAdress);

    franAdress();
  }

  window.Ovningsbana = { lagg: lagg, nivaer: nivaer, bedom: bedom };

  document.addEventListener("DOMContentLoaded", starta);
})();
