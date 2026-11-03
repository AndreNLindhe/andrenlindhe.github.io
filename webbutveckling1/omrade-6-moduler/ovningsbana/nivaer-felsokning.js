/* Övningsbanan område 6, avsnittet Felsökning.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Startkoden i de två första ger ett fel som motorn visar med radnummer, precis som
   konsolen. Den tredje ger inget fel alls – det är det svåra felet. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  var KNAPP = "button { font: inherit; padding: 0.35rem 0.9rem; border: 2px solid #1e3a5f; border-radius: 6px; background: #ffffff; color: #1e3a5f; cursor: pointer; }\n";

  Ovningsbana.lagg("felsokning", [
    {
      id: "js-fel-null-1",
      sprak: "js",
      rubrik: "Cannot read properties of null",
      typ: "andra",
      forklaring:
        "<p>Bibliotekets knapp ska visa och dölja dina lån. Kör koden och läs felet.</p>" +
        "<p><code>null</code> betyder att <code>querySelector</code> inte hittade något. " +
        "Jämför selektorn med HTML:en nedanför och rätta koden – HTML:en ska vara som den är.</p>",
      html:
        '<button type="button" class="visa-lan">Mina lån</button>' +
        '<ul class="lan-lista" hidden><li>Fjällflora, åter 12/2</li><li>Svampboken, åter 19/2</li></ul>',
      bas: KNAPP +
        ".lan-lista { margin: 0.6rem 0 0; padding: 0.5rem 0.5rem 0.5rem 1.6rem; border: 1px solid #c9d3df; border-radius: 6px; }",
      start: k(
        'const knapp = document.querySelector(".visa-lanen");',
        'const lista = document.querySelector(".lan-lista");',
        "",
        'knapp.addEventListener("click", function () {',
        "  lista.hidden = !lista.hidden;",
        "});"),
      losning: k(
        'const knapp = document.querySelector(".visa-lan");',
        'const lista = document.querySelector(".lan-lista");',
        "",
        'knapp.addEventListener("click", function () {',
        "  lista.hidden = !lista.hidden;",
        "});"),
      prov: [[], [{ klicka: ".visa-lan" }], [{ klicka: ".visa-lan" }, { klicka: ".visa-lan" }]],
      visa: 1,
      felvag: k(
        'const knapp = document.querySelector("button");',
        'const lista = document.querySelector(".lan-lista");',
        "",
        'knapp.addEventListener("click", function () {',
        "  lista.hidden = !lista.hidden;",
        "});"),
      krav: [{
        text: /querySelector\(\s*["']\.visa-lan["']\s*\)/,
        ledtrad: "Det fungerar, men använd knappens klass, <code>.visa-lan</code>. Bara <code>button</code> tar fel knapp den dag sidan får fler."
      }]
    },
    {
      id: "js-fel-namn-1",
      sprak: "js",
      rubrik: "is not defined",
      typ: "andra",
      forklaring:
        "<p>Väderstationen ska visa temperaturen. Kör koden och läs felet – det säger " +
        "vilket namn som inte finns, och på vilken rad.</p>" +
        "<p>Rätta stavfelet. Temperaturen ska fortfarande hämtas ur variabeln.</p>",
      html: '<p class="station">Bryggan, kl 14 <span class="grader">–</span></p>',
      bas:
        ".station { display: inline-block; margin: 0; padding: 0.6rem 0.9rem; border-radius: 8px; background: #0f3d56; color: #ffffff; }\n" +
        ".grader { margin-left: 0.5rem; font-size: 1.5rem; font-weight: 700; }",
      start: k(
        "const temperatur = 7;",
        'const ruta = document.querySelector(".grader");',
        "",
        'ruta.textContent = temperatru + " °C";'),
      losning: k(
        "const temperatur = 7;",
        'const ruta = document.querySelector(".grader");',
        "",
        'ruta.textContent = temperatur + " °C";'),
      felvag: k(
        "const temperatur = 7;",
        'const ruta = document.querySelector(".grader");',
        "",
        'ruta.textContent = "7 °C";'),
      krav: [{
        text: /ruta\.textContent\s*=\s*(temperatur\b|`\$\{\s*temperatur\s*\})/,
        ledtrad: "Rätt text, men nu ändras den inte när temperaturen gör det. Hämta värdet ur <code>temperatur</code>."
      }]
    },
    {
      id: "js-fel-tyst-1",
      sprak: "js",
      rubrik: "Inget fel, men inget händer",
      typ: "andra",
      forklaring:
        "<p>Man ska kunna välja platser i biosalongen. Kör koden och klicka på en plats " +
        "i ditt resultat. Inget händer – och inget fel visas.</p>" +
        "<p>Stilmallen färgar en vald plats med regeln <code>.plats.vald</code>. " +
        "Jämför klassnamnet i koden med det. Ett klassnamn måste stämma exakt på alla " +
        "ställen det står.</p>",
      html:
        '<div class="salong"><button type="button" class="plats">A1</button>' +
        '<button type="button" class="plats">A2</button>' +
        '<button type="button" class="plats">A3</button>' +
        '<button type="button" class="plats">A4</button></div>',
      bas:
        ".salong { display: flex; gap: 0.4rem; }\n" +
        ".plats { width: 3rem; padding: 0.5rem 0; font: inherit; border: 2px solid #7a1f2b; border-radius: 6px 6px 2px 2px; background: #ffffff; color: #7a1f2b; cursor: pointer; }\n" +
        ".plats.vald { background: #7a1f2b; color: #ffffff; }",
      fore: k(
        'const platser = document.querySelectorAll(".plats");',
        "",
        "platser.forEach(function (plats) {",
        '  plats.addEventListener("click", function () {',
        ""),
      start: '    plats.classList.toggle("valt");',
      efter: k(
        "",
        "  });",
        "});"),
      losning: '    plats.classList.toggle("vald");',
      prov: [
        [],
        [{ klicka: ".salong .plats:nth-child(2)" }, { klicka: ".salong .plats:nth-child(3)" }],
        [{ klicka: ".salong .plats:nth-child(2)" }, { klicka: ".salong .plats:nth-child(2)" }]
      ],
      visa: 1,
      jamfor: ".plats",
      stilar: ["background-color", "color"],
      krav: [{
        text: /classList\.toggle\(\s*["']vald["']\s*\)/,
        ledtrad: "Växla klassen <code>vald</code> med <code>classList.toggle</code>, samma namn som i stilmallen."
      }]
    }
  ], "Felsökning");
})();
