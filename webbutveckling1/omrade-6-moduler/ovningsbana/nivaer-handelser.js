/* Övningsbanan område 6, avsnittet Händelser.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  var KNAPP = "button { font: inherit; padding: 0.35rem 0.9rem; border: 2px solid #1e3a5f; border-radius: 6px; background: #ffffff; color: #1e3a5f; cursor: pointer; }\n";

  Ovningsbana.lagg("handelser", [
    {
      id: "js-click-1",
      sprak: "js",
      rubrik: "Gilla receptet",
      typ: "andra",
      forklaring:
        "<p>Receptsajten har en Gilla-knapp. Lyssnaren finns, men den gör ingenting.</p>" +
        "<p>Fyll i funktionen så att varje klick ökar <code>gillar</code> med ett och " +
        "visar talet i <code>antal</code>, till exempel <b>2 gillar</b>.</p>",
      html:
        '<article class="recept"><h3>Kanelbullar</h3><p>40 minuter · 24 bullar</p>' +
        '<button type="button" class="gilla">Gilla</button> <span class="gilla-antal">0 gillar</span></article>',
      bas: KNAPP +
        ".recept { max-width: 16rem; padding: 0.8rem 1rem; border: 1px solid #d6cfc4; border-radius: 8px; }\n" +
        ".recept h3 { margin: 0; } .recept p { margin: 0.2rem 0 0.7rem; color: #555555; }",
      fore: k(
        'const knapp = document.querySelector(".gilla");',
        'const antal = document.querySelector(".gilla-antal");',
        "let gillar = 0;",
        "",
        ""),
      start: k(
        'knapp.addEventListener("click", function () {',
        "  ",
        "});"),
      losning: k(
        'knapp.addEventListener("click", function () {',
        "  gillar = gillar + 1;",
        '  antal.textContent = gillar + " gillar";',
        "});"),
      prov: [[], [{ klicka: ".gilla" }], [{ klicka: ".gilla" }, { klicka: ".gilla" }, { klicka: ".gilla" }]],
      felvag: k(
        "knapp.onclick = function () {",
        "  gillar = gillar + 1;",
        '  antal.textContent = gillar + " gillar";',
        "};"),
      krav: [{
        text: /knapp\.addEventListener\(\s*["']click["']/,
        ledtrad: "Det fungerar, men nivån övar <code>addEventListener</code>. Med <code>onclick</code> kan knappen bara ha en lyssnare."
      }]
    },
    {
      id: "js-input-1",
      sprak: "js",
      rubrik: "Tecken kvar",
      typ: "skriv",
      forklaring:
        "<p>Gästboken tar högst 60 tecken. Under rutan ska det stå hur många som är " +
        "kvar, och siffran ska ändras <b>medan</b> man skriver.</p>" +
        "<p>Lyssna på händelsen <code>input</code> på <code>falt</code>. I funktionen: " +
        "räkna ut <code>MAX - falt.value.length</code> och sätt texten i " +
        "<code>kvar</code> till till exempel <b>57 tecken kvar</b>.</p>",
      html:
        '<label for="meddelande">Ditt meddelande</label>' +
        '<textarea id="meddelande" class="meddelande" maxlength="60" rows="2"></textarea>' +
        '<p class="kvar">60 tecken kvar</p>',
      bas:
        "label { display: block; font-weight: 700; margin-bottom: 0.3rem; }\n" +
        ".meddelande { display: block; box-sizing: border-box; width: 100%; max-width: 18rem; font: inherit; }\n" +
        ".kvar { margin: 0.3rem 0 0; color: #555555; font-size: 0.9rem; }",
      fore: k(
        'const falt = document.querySelector(".meddelande");',
        'const kvar = document.querySelector(".kvar");',
        "const MAX = 60;",
        "",
        ""),
      start: "",
      losning: k(
        'falt.addEventListener("input", function () {',
        '  kvar.textContent = (MAX - falt.value.length) + " tecken kvar";',
        "});"),
      prov: [[], [{ skriv: [".meddelande", "Tack"] }], [{ skriv: [".meddelande", "Vi ses vid sjön klockan sju"] }]],
      felvag: k(
        'falt.addEventListener("change", function () {',
        '  kvar.textContent = (MAX - falt.value.length) + " tecken kvar";',
        "});"),
      krav: [{
        text: /addEventListener\(\s*["']input["']/,
        ledtrad: "Det ser rätt ut här, men <code>change</code> sker först när man lämnar fältet. Lyssna på <code>input</code>, så ändras siffran för varje tecken."
      }]
    },
    {
      id: "js-submit-1",
      sprak: "js",
      rubrik: "Anmälan som stannar kvar",
      typ: "andra",
      forklaring:
        "<p>När formuläret skickas ska tacket visas. Men webbläsaren skickar formuläret " +
        "och laddar om sidan, så tacket hinner aldrig synas. Kör koden som den är, så " +
        "ser du vad som händer.</p>" +
        "<p>Stoppa det webbläsaren annars gör med <code>handelse.preventDefault()</code>, " +
        "först i lyssnaren.</p>",
      html:
        '<form class="anmalan"><label for="namn">Namn</label> ' +
        '<input id="namn" class="namn" required> ' +
        '<button>Anmäl</button></form>' +
        '<p class="tack" hidden>Tack, du är anmäld till prova-på-kvällen.</p>',
      bas: KNAPP +
        "input { font: inherit; padding: 0.3rem; width: 8rem; }\n" +
        ".anmalan { margin: 0 0 0.6rem; }\n" +
        ".tack { margin: 0; padding: 0.6rem 0.8rem; border-radius: 6px; background: #dcfce7; }",
      fore: k(
        'const formular = document.querySelector(".anmalan");',
        'const tack = document.querySelector(".tack");',
        "",
        ""),
      start: k(
        'formular.addEventListener("submit", function (handelse) {',
        "  tack.hidden = false;",
        "});"),
      efter: k(
        "",
        "",
        "// Scenen visar vad som händer om formuläret skickas på riktigt.",
        'formular.addEventListener("submit", function (handelse) {',
        "  if (!handelse.defaultPrevented) {",
        '    document.body.textContent = "Sidan laddades om. Det du skrev är borta.";',
        "  }",
        "});"),
      losning: k(
        'formular.addEventListener("submit", function (handelse) {',
        "  handelse.preventDefault();",
        "  tack.hidden = false;",
        "});"),
      prov: [[], [{ skriv: [".namn", "Kim"] }, { skicka: ".anmalan" }]],
      krav: [{
        text: /preventDefault\(\s*\)/,
        ledtrad: "Använd <code>handelse.preventDefault()</code> för att stoppa att formuläret skickas."
      }]
    },
    {
      id: "js-delegering-1",
      sprak: "js",
      rubrik: "En lyssnare för alla storlekar",
      typ: "skriv",
      forklaring:
        "<p>Klubbtröjan finns i tre storlekar. Klickar man på en storlek ska texten under " +
        "bli till exempel <b>Vald storlek: M</b>.</p>" +
        "<p>Sätt <b>en enda</b> lyssnare på hela raden, <code>rad</code>. Ta reda på " +
        "vilken knapp som klickades med <code>handelse.target.closest(\"button\")</code>, " +
        "och avsluta med <code>return</code> om klicket inte var på en knapp. Det är så " +
        "galleriet i modulbiblioteket gör.</p>",
      html:
        '<div class="storlekar"><button type="button">S</button><button type="button">M</button><button type="button">L</button></div>' +
        '<p class="vald">Vald storlek: ingen</p>',
      bas: KNAPP +
        ".storlekar { display: flex; gap: 0.5rem; }\n" +
        ".storlekar button { width: 3rem; }\n" +
        ".vald { margin: 0.7rem 0 0; }",
      fore: k(
        'const rad = document.querySelector(".storlekar");',
        'const vald = document.querySelector(".vald");',
        "",
        ""),
      start: "",
      losning: k(
        'rad.addEventListener("click", function (handelse) {',
        '  const knapp = handelse.target.closest("button");',
        "  if (!knapp) { return; }",
        '  vald.textContent = "Vald storlek: " + knapp.textContent;',
        "});"),
      prov: [
        [],
        [{ klicka: ".storlekar button:nth-child(2)" }],
        [{ klicka: ".storlekar button:nth-child(3)" }, { klicka: ".storlekar button:nth-child(1)" }],
        [{ klicka: ".storlekar" }]
      ],
      visa: 1,
      felvag: k(
        'const knappar = document.querySelectorAll(".storlekar button");',
        "",
        "knappar.forEach(function (knapp) {",
        '  knapp.addEventListener("click", function () {',
        '    vald.textContent = "Vald storlek: " + knapp.textContent;',
        "  });",
        "});"),
      krav: [{
        text: /rad\.addEventListener\(\s*["']click["']/,
        ledtrad: "Det fungerar, men nivån övar en enda lyssnare på <code>rad</code> i stället för en per knapp."
      }]
    }
  ], "Händelser");
})();
