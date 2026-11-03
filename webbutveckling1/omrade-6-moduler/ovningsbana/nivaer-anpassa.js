/* Övningsbanan område 6, avsnittet Anpassa en modul.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Nivåerna är byggda som modulbibliotekets moduler: en kapsel, en ÄNDRA HÄR-zon
   överst och resten låst. Eleven ändrar bara zonen. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  var KNAPP = "button { font: inherit; padding: 0.35rem 0.9rem; border: 2px solid #1e3a5f; border-radius: 6px; background: #ffffff; color: #1e3a5f; cursor: pointer; }\n";

  function zon(rubrik) {
    return k(
      "// " + rubrik,
      "",
      "(function () {",
      '  "use strict";',
      "",
      "  /* ===== ÄNDRA HÄR ===== */",
      "",
      "");
  }

  var SLUT = k(
    "",
    "",
    "  /* ===== SLUT PÅ ÄNDRA HÄR – nedanför behöver ingenting ändras ===== */",
    "");

  Ovningsbana.lagg("anpassa", [
    {
      id: "js-anpassa-text-1",
      sprak: "js",
      rubrik: "Knappens texter",
      typ: "andra",
      forklaring:
        "<p>Antikvariatet har hämtat en Läs mer-modul från nätet. Den fungerar, men " +
        "knappen talar engelska.</p>" +
        "<p>Ändra texterna i ÄNDRA HÄR-zonen: knappen ska säga <b>Läs mer</b> när texten " +
        "är dold och <b>Visa mindre</b> när den syns. Behåll citattecknen.</p>",
      html:
        '<article class="bok"><h3>Kartbok över Norrland, 1952</h3><p>Gott skick, 180 kr.</p>' +
        '<p class="lasmer-text">Pärmen är lagad med tejp. Två kartor har blyertsanteckningar i marginalen.</p>' +
        '<button type="button" class="lasmer-knapp" aria-expanded="false" hidden>Läs mer</button></article>',
      bas: KNAPP +
        ".bok { max-width: 20rem; padding: 0.8rem 1rem; border: 1px solid #c8bca8; border-radius: 8px; background: #fbf8f2; }\n" +
        ".bok h3 { margin: 0; font-size: 1rem; } .bok p { margin: 0.3rem 0 0.6rem; }",
      fore: zon("lasmer.js – visar resten av en text när man klickar på knappen."),
      start: k(
        '  const KNAPP = ".lasmer-knapp";',
        '  const TEXT = ".lasmer-text";',
        '  const TEXT_STANGD = "Read more";',
        '  const TEXT_OPPEN = "Show less";'),
      efter: SLUT + k(
        "  const knapp = document.querySelector(KNAPP);",
        "  const text = document.querySelector(TEXT);",
        "  if (!knapp || !text) { return; }",
        "",
        "  knapp.hidden = false;",
        "  knapp.textContent = TEXT_STANGD;",
        "  text.hidden = true;",
        "",
        '  knapp.addEventListener("click", function () {',
        "    text.hidden = !text.hidden;",
        "    knapp.textContent = text.hidden ? TEXT_STANGD : TEXT_OPPEN;",
        '    knapp.setAttribute("aria-expanded", String(!text.hidden));',
        "  });",
        "})();"),
      losning: k(
        '  const KNAPP = ".lasmer-knapp";',
        '  const TEXT = ".lasmer-text";',
        '  const TEXT_STANGD = "Läs mer";',
        '  const TEXT_OPPEN = "Visa mindre";'),
      prov: [[], [{ klicka: ".lasmer-knapp" }]],
      krav: [{
        text: /TEXT_STANGD\s*=\s*["']Läs mer["'][\s\S]*TEXT_OPPEN\s*=\s*["']Visa mindre["']/,
        ledtrad: "Ändra texterna i <code>TEXT_STANGD</code> och <code>TEXT_OPPEN</code>."
      }]
    },
    {
      id: "js-anpassa-klass-1",
      sprak: "js",
      rubrik: "Modulen som inte hittar knappen",
      typ: "andra",
      forklaring:
        "<p>Cykelköket har lagt in en modul som ska visa och dölja bokningsrutan. " +
        "Kör koden: knappen syns inte, och inget fel visas.</p>" +
        "<p>Modulen avslutar tyst när den inte hittar sina element – så är alla moduler " +
        "byggda. Jämför klassnamnen i ÄNDRA HÄR med HTML:en nedanför och ändra i " +
        "<b>modulen</b>, inte i HTML:en.</p>",
      html:
        '<button type="button" class="bokaknapp" hidden>Boka tid</button>' +
        '<form class="bokning" hidden><label for="dag">Dag</label> <input id="dag" class="dag" size="8"></form>' +
        '<p class="adress">Cykelköket, Hamngatan 4</p>',
      bas: KNAPP +
        "input { font: inherit; padding: 0.3rem; }\n" +
        ".bokning { margin: 0.6rem 0 0; padding: 0.6rem; border: 1px dashed #1e3a5f; border-radius: 6px; }\n" +
        ".adress { margin: 0.6rem 0 0; color: #555555; }",
      fore: zon("bokning.js – visar och döljer bokningsrutan."),
      start: k(
        '  const KNAPP = ".boka-knapp";',
        '  const RUTA = ".bokning";'),
      efter: SLUT + k(
        "  const knapp = document.querySelector(KNAPP);",
        "  const ruta = document.querySelector(RUTA);",
        "  if (!knapp || !ruta) { return; }",
        "",
        "  knapp.hidden = false;",
        "",
        '  knapp.addEventListener("click", function () {',
        "    ruta.hidden = !ruta.hidden;",
        "  });",
        "})();"),
      losning: k(
        '  const KNAPP = ".bokaknapp";',
        '  const RUTA = ".bokning";'),
      prov: [[], [{ klicka: ".bokaknapp" }], [{ klicka: ".bokaknapp" }, { klicka: ".bokaknapp" }]],
      visa: 1,
      krav: [{
        text: /KNAPP\s*=\s*["']\.bokaknapp["']/,
        ledtrad: "Ändra <code>KNAPP</code> så att den stämmer med knappens klass i HTML:en."
      }]
    },
    {
      id: "js-anpassa-objekt-1",
      sprak: "js",
      rubrik: "En grupp till i galleriet",
      typ: "andra",
      forklaring:
        "<p>Tygaffären Stuvbiten filtrerar sina tyger med en galleri-modul. Knapparna " +
        "skapas ur objektet <code>GRUPPNAMN</code>. Det finns blå tyger, men ingen knapp " +
        "för dem.</p>" +
        "<p>Lägg till en rad i objektet för gruppen <code>bla</code> med knapptexten " +
        "<b>Blå</b>, sist. Glöm inte kommatecknet mellan raderna.</p>",
      html:
        '<div class="filter" hidden></div>' +
        '<ul class="tyger">' +
        '<li data-grupp="rod">Tomatröd bomull</li>' +
        '<li data-grupp="bla">Marinblå linne</li>' +
        '<li data-grupp="gron">Mossgrön sammet</li>' +
        '<li data-grupp="bla">Isblå poplin</li>' +
        '</ul>',
      bas:
        ".filter { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.7rem; }\n" +
        ".filter button { font: inherit; padding: 0.3rem 0.7rem; border: 2px solid #4a3b2a; border-radius: 999px; background: #ffffff; cursor: pointer; }\n" +
        '.filter button[aria-pressed="true"] { background: #4a3b2a; color: #ffffff; }\n' +
        ".tyger { margin: 0; padding: 0; list-style: none; }\n" +
        ".tyger li { padding: 0.3rem 0; border-bottom: 1px solid #e2dccf; }",
      fore: zon("galleri.js – filtrerar en lista med knappar, en per grupp."),
      start: k(
        '  const FILTER = ".filter";',
        '  const DELAR = ".tyger li";',
        "  const GRUPPNAMN = {",
        '    alla: "Alla",',
        '    rod: "Röda",',
        '    gron: "Gröna"',
        "  };"),
      efter: SLUT + k(
        "  const rad = document.querySelector(FILTER);",
        "  const delar = document.querySelectorAll(DELAR);",
        "  if (!rad || !delar.length) { return; }",
        "",
        "  Object.keys(GRUPPNAMN).forEach(function (grupp) {",
        '    const knapp = document.createElement("button");',
        '    knapp.type = "button";',
        "    knapp.dataset.valj = grupp;",
        "    knapp.textContent = GRUPPNAMN[grupp];",
        "    rad.appendChild(knapp);",
        "  });",
        "  rad.hidden = false;",
        "",
        '  rad.addEventListener("click", function (handelse) {',
        '    const knapp = handelse.target.closest("button");',
        "    if (!knapp) { return; }",
        "    delar.forEach(function (del) {",
        '      del.hidden = knapp.dataset.valj !== "alla" && del.dataset.grupp !== knapp.dataset.valj;',
        "    });",
        '    rad.querySelectorAll("button").forEach(function (annan) {',
        '      annan.setAttribute("aria-pressed", String(annan === knapp));',
        "    });",
        "  });",
        "})();"),
      losning: k(
        '  const FILTER = ".filter";',
        '  const DELAR = ".tyger li";',
        "  const GRUPPNAMN = {",
        '    alla: "Alla",',
        '    rod: "Röda",',
        '    gron: "Gröna",',
        '    bla: "Blå"',
        "  };"),
      prov: [[], [{ klicka: '.filter button[data-valj="bla"]' }], [{ klicka: '.filter button[data-valj="rod"]' }]],
      visa: 1,
      krav: [{
        text: /["']?bla["']?\s*:\s*["']Blå["']/,
        ledtrad: "Lägg till raden <code>bla: \"Blå\"</code> i <code>GRUPPNAMN</code>."
      }]
    }
  ], "Anpassa en modul");
})();
