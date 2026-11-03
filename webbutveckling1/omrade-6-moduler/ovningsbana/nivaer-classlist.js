/* Övningsbanan område 6, avsnittet classList.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Klasserna ändrar färger, så nivåerna jämför stilar – inte bara läge och storlek. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  var KNAPP = "button { font: inherit; padding: 0.35rem 0.9rem; border: 2px solid #1e3a5f; border-radius: 6px; background: #ffffff; color: #1e3a5f; cursor: pointer; }\n";

  Ovningsbana.lagg("classlist", [
    {
      id: "js-toggle-1",
      sprak: "js",
      rubrik: "Spela och pausa",
      typ: "andra",
      forklaring:
        "<p>Podden Kvällsljud har en spelare. Klassen <code>spelar</code> på " +
        "<code>.spelare</code> gör den mörk. Första klicket ska starta, andra klicket " +
        "pausa, tredje starta igen.</p>" +
        "<p>Nu går det bara att starta. Byt <code>add</code> mot den metod i " +
        "<code>classList</code> som växlar.</p>",
      html:
        '<div class="spelare"><button type="button" class="spela">Spela</button>' +
        '<p class="avsnitt">Avsnitt 12: Nattåget norrut</p></div>',
      bas: KNAPP +
        ".spelare { display: flex; align-items: center; gap: 0.8rem; max-width: 20rem; padding: 0.7rem 0.9rem; border-radius: 8px; background: #e8eef5; color: #1e3a5f; }\n" +
        ".spelare.spelar { background: #1e3a5f; color: #ffffff; }\n" +
        ".avsnitt { margin: 0; }",
      fore: k(
        'const spelare = document.querySelector(".spelare");',
        'const knapp = document.querySelector(".spela");',
        "",
        ""),
      start: k(
        'knapp.addEventListener("click", function () {',
        '  spelare.classList.add("spelar");',
        "});"),
      losning: k(
        'knapp.addEventListener("click", function () {',
        '  spelare.classList.toggle("spelar");',
        "});"),
      prov: [[], [{ klicka: ".spela" }], [{ klicka: ".spela" }, { klicka: ".spela" }]],
      visa: 1,
      jamfor: ".spelare, .spela, .avsnitt",
      stilar: ["background-color", "color"],
      felvag: k(
        'knapp.addEventListener("click", function () {',
        '  if (spelare.className === "spelare spelar") {',
        '    spelare.className = "spelare";',
        "  } else {",
        '    spelare.className = "spelare spelar";',
        "  }",
        "});"),
      krav: [{
        text: /classList\.toggle\(\s*["']spelar["']\s*\)/,
        ledtrad: "Det fungerar, men nivån övar <code>classList</code>. <code>toggle</code> gör samma sak på en rad."
      }]
    },
    {
      id: "js-flikar-1",
      sprak: "js",
      rubrik: "Flikarna",
      typ: "skriv",
      forklaring:
        "<p>Bokningssidan har tre flikar. Den valda har klassen <code>aktiv</code>. " +
        "Varje flik har redan en lyssnare, men den är tom.</p>" +
        "<p>Skriv det som ska hända vid ett klick: ta bort <code>aktiv</code> från " +
        "<b>alla</b> flikar med <code>forEach</code> och <code>classList.remove</code>, " +
        "och lägg sedan till den på fliken som klickades med <code>classList.add</code>.</p>",
      html:
        '<div class="flikrad"><button type="button" class="flik aktiv">Idag</button>' +
        '<button type="button" class="flik">Imorgon</button>' +
        '<button type="button" class="flik">Helgen</button></div>',
      bas:
        ".flikrad { display: flex; border-bottom: 2px solid #1e3a5f; }\n" +
        ".flik { font: inherit; padding: 0.4rem 0.9rem; border: 0; background: #e8eef5; color: #1e3a5f; cursor: pointer; }\n" +
        ".flik.aktiv { background: #1e3a5f; color: #ffffff; }",
      fore: k(
        'const flikar = document.querySelectorAll(".flik");',
        "",
        "flikar.forEach(function (flik) {",
        '  flik.addEventListener("click", function () {',
        ""),
      start: "    ",
      efter: k(
        "",
        "  });",
        "});"),
      losning: k(
        "    flikar.forEach(function (annan) {",
        '      annan.classList.remove("aktiv");',
        "    });",
        '    flik.classList.add("aktiv");'),
      prov: [
        [],
        [{ klicka: ".flikrad .flik:nth-child(2)" }],
        [{ klicka: ".flikrad .flik:nth-child(3)" }, { klicka: ".flikrad .flik:nth-child(2)" }]
      ],
      visa: 1,
      jamfor: ".flik",
      stilar: ["background-color", "color"],
      felvag: k(
        '    document.querySelector(".aktiv").className = "flik";',
        '    flik.className = "flik aktiv";'),
      krav: [
        { text: /classList\.remove\(\s*["']aktiv["']\s*\)/, ledtrad: "Det fungerar, men nivån övar <code>classList</code>. Ta bort klassen med <code>classList.remove</code>." },
        { text: /classList\.add\(\s*["']aktiv["']\s*\)/, ledtrad: "Det fungerar, men lägg till klassen med <code>classList.add</code>." }
      ]
    },
    {
      id: "js-contains-1",
      sprak: "js",
      rubrik: "Visa svar, dölj svar",
      typ: "skriv",
      forklaring:
        "<p>Frågan visar och döljer sitt svar redan. Men knappen säger alltid " +
        "<b>Visa svar</b>, även när svaret syns.</p>" +
        "<p>Lägg till ett <code>if</code> efter raden med <code>toggle</code>. Fråga med " +
        "<code>svar.classList.contains(\"oppen\")</code> om svaret är öppet, och sätt " +
        "knappens text till <b>Dölj svar</b> eller <b>Visa svar</b>.</p>",
      html:
        '<div class="fraga"><h3>Kan jag ta med cykeln på tåget?</h3>' +
        '<p class="svar">Ja, på regionaltågen utom vardagar 7–9.</p>' +
        '<button type="button" class="fraga-knapp">Visa svar</button></div>',
      bas: KNAPP +
        ".fraga { max-width: 20rem; padding: 0.7rem 0.9rem; border-left: 4px solid #1e3a5f; background: #f4f6f9; }\n" +
        ".fraga h3 { margin: 0 0 0.5rem; font-size: 1rem; }\n" +
        ".svar { display: none; margin: 0 0 0.5rem; }\n" +
        ".svar.oppen { display: block; }",
      fore: k(
        'const knapp = document.querySelector(".fraga-knapp");',
        'const svar = document.querySelector(".svar");',
        "",
        'knapp.addEventListener("click", function () {',
        ""),
      start: '  svar.classList.toggle("oppen");\n  ',
      efter: "\n});",
      losning: k(
        '  svar.classList.toggle("oppen");',
        '  if (svar.classList.contains("oppen")) {',
        '    knapp.textContent = "Dölj svar";',
        "  } else {",
        '    knapp.textContent = "Visa svar";',
        "  }"),
      prov: [[], [{ klicka: ".fraga-knapp" }], [{ klicka: ".fraga-knapp" }, { klicka: ".fraga-knapp" }]],
      visa: 1,
      felvag: k(
        '  svar.classList.toggle("oppen");',
        '  knapp.textContent = knapp.textContent === "Visa svar" ? "Dölj svar" : "Visa svar";'),
      krav: [{
        text: /classList\.contains\(\s*["']oppen["']\s*\)/,
        ledtrad: "Det fungerar, men nivån övar <code>classList.contains</code>. Låt klassen avgöra texten, inte texten själv."
      }]
    }
  ], "classList");
})();
