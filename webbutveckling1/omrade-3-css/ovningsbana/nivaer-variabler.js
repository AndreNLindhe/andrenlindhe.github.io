/* Övningsbanan, avsnitten Variabler och Blandat.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Formatet står i motor.js. Scenerna är påhittade och får inte likna
   referensprojektet (Vikstad) eller område 8:s kunder. */

(function () {
  /* ---------------- Variabler ---------------- */

  Ovningsbana.lagg("variabler", [
    {
      id: "var-anvand-1",
      rubrik: "Använd accentfärgen",
      typ: "andra",
      forklaring:
        "<p>Sajten har en accentfärg i variabeln <code>--accent</code>, definierad " +
        "på <code>:root</code>. Erbjudandet är fortfarande grått. Det ska få " +
        "accentfärgen som bakgrund.</p>" +
        "<p>Byt ut det grå värdet mot <code>var(--accent)</code>. Ändras " +
        "accentfärgen någon gång följer erbjudandet med av sig självt.</p>",
      html: '<p class="erbjudande">Halva priset på alla kurser i november</p>',
      bas:
        ":root { --accent: #c2410c; }\n" +
        ".erbjudande { margin: 0; padding: 0.75rem 1rem; border-radius: 6px; color: #ffffff; font-weight: 700; }",
      fore: ".erbjudande {\n",
      start: "  background: #9ca3af;",
      efter: "\n}",
      losning: "  background: var(--accent);",
      jamfor: ".erbjudande",
      stilar: ["background-color"],
      felvag: "  background: #c2410c;",
      krav: [{
        text: /var\(\s*--accent\s*\)/,
        ledtrad: "Det ser rätt ut, men nivån övar variabler. Hämta färgen med <code>var(--accent)</code> i stället för att skriva värdet."
      }]
    },
    {
      id: "var-felstavad-1",
      rubrik: "Variabeln som inte fungerar",
      typ: "andra",
      forklaring:
        "<p>Knappen ska vara lila. Färgen finns i variabeln <code>--accent</code>, " +
        "men knappen får ingen bakgrund alls.</p>" +
        "<p>En variabel som inte finns ger inget fel. Raden räknas bara som om " +
        "den inte fanns – resten av regeln gäller, och därför är texten redan " +
        "vit. Läs namnet bokstav för bokstav och rätta det.</p>",
      html: '<button type="button" class="lila-knapp">Gå med i klubben</button>',
      bas:
        ":root { --accent: #7c3aed; }\n" +
        ".lila-knapp { font: inherit; font-weight: 700; padding: 0.6rem 1.2rem; border: 2px solid #7c3aed; border-radius: 6px; background: transparent; }",
      fore: ".lila-knapp {\n  color: #ffffff;\n",
      start: "  background: var(--acent);",
      efter: "\n}",
      losning: "  background: var(--accent);",
      jamfor: ".lila-knapp",
      stilar: ["background-color", "color"],
      krav: [{
        text: /var\(\s*--accent\s*\)/,
        ledtrad: "Det ser rätt ut, men rätta variabelnamnet i stället för att skriva färgen direkt."
      }]
    },
    {
      id: "var-definiera-1",
      rubrik: "En egen variabel",
      typ: "skriv",
      forklaring:
        "<p>En lista-app har samma ljusgröna yta, <b>#eaf2ee</b>, på två ställen. " +
        "Skriv värdet en enda gång.</p>" +
        "<p>Definiera variabeln <code>--yta</code> på <code>:root</code> och använd " +
        "den med <code>var(--yta)</code> som bakgrund på både " +
        "<code>.lista-huvud</code> och <code>.lista-innehall</code>.</p>",
      html:
        '<header class="lista-huvud">Mina listor</header>' +
        '<ul class="lista-innehall"><li>Handla</li><li>Läxor</li><li>Packa inför resan</li></ul>',
      bas:
        ".lista-huvud { padding: 0.6rem 1rem; font-weight: 700; color: #1f4b33; border-bottom: 2px solid #b9d3c5; }\n" +
        ".lista-innehall { margin: 0; padding: 0.6rem 1rem 0.6rem 2rem; }",
      fore: "",
      start: ":root {\n\n}\n\n.lista-huvud {\n\n}\n\n.lista-innehall {\n\n}",
      efter: "",
      losning: ":root {\n  --yta: #eaf2ee;\n}\n\n.lista-huvud {\n  background: var(--yta);\n}\n\n.lista-innehall {\n  background: var(--yta);\n}",
      jamfor: ".lista-huvud, .lista-innehall",
      stilar: ["background-color"],
      felvag: ".lista-huvud {\n  background: #eaf2ee;\n}\n\n.lista-innehall {\n  background: #eaf2ee;\n}",
      krav: [
        { text: /--yta\s*:/, ledtrad: "Det ser rätt ut, men definiera färgen som variabeln <code>--yta</code> på <code>:root</code>." },
        { pa: ".lista-huvud", egenskap: "background", varde: /var\(\s*--yta\s*\)/, ledtrad: "Det ser rätt ut, men använd <code>var(--yta)</code> på <code>.lista-huvud</code>." },
        { pa: ".lista-innehall", egenskap: "background", varde: /var\(\s*--yta\s*\)/, ledtrad: "Det ser rätt ut, men använd <code>var(--yta)</code> på <code>.lista-innehall</code>." }
      ]
    }
  ]);

  /* ---------------- Blandat ---------------- */

  Ovningsbana.lagg("blandat", [
    {
      id: "mix-meny-1",
      rubrik: "Klubbens meny",
      typ: "skriv",
      forklaring:
        "<p>Brädspelsklubben behöver en meny. Länkarna ska stå på rad med " +
        "<b>1rem</b> mellanrum. Menyn ska ha bakgrunden <b>#2d3a4a</b> och " +
        "<b>1rem</b> luft innanför kanten, och länkarna ska vara vita, " +
        "<b>#ffffff</b>.</p>" +
        "<p>Det krävs två regler: en för <code>.klubb-meny</code> och en för " +
        "länkarna i den. Allt du behöver har du övat på tidigare i banan.</p>",
      html:
        '<nav class="klubb-meny" aria-label="Klubbens meny">' +
        '<a href="#">Hem</a><a href="#">Spel</a><a href="#">Träffar</a><a href="#">Bli medlem</a>' +
        '</nav>',
      bas: ".klubb-meny a { text-decoration: none; }",
      fore: "",
      start: "",
      efter: "",
      losning:
        ".klubb-meny {\n  display: flex;\n  gap: 1rem;\n  padding: 1rem;\n  background: #2d3a4a;\n}\n\n" +
        ".klubb-meny a {\n  color: #ffffff;\n}",
      jamfor: ".klubb-meny, .klubb-meny a",
      stilar: ["color", "background-color"],
      krav: [
        { pa: ".klubb-meny", egenskap: "display", varde: /flex/ },
        { pa: ".klubb-meny", egenskap: "gap" },
        { pa: ".klubb-meny", egenskap: "padding" }
      ]
    },
    {
      id: "mix-kort-1",
      rubrik: "Loppisens fynd",
      typ: "skriv",
      forklaring:
        "<p>Loppisens fynd ska stå på rad, fortsätta på nästa rad när platsen tar " +
        "slut och ha <b>1rem</b> mellanrum. Varje fynd ska få en ram på " +
        "<b>2px</b>, heldragen, i färgen från variabeln <code>--ram</code> som " +
        "redan finns på <code>:root</code>.</p>" +
        "<p>Skriv en regel för <code>.loppis</code> och en för " +
        "<code>.loppis-fynd</code>. Bredden på fynden är redan satt.</p>",
      html:
        '<div class="loppis">' +
        '<article class="loppis-fynd"><h3>Kaffekanna</h3><p>40 kr</p></article>' +
        '<article class="loppis-fynd"><h3>Skrivmaskin</h3><p>250 kr</p></article>' +
        '<article class="loppis-fynd"><h3>Vinylskivor</h3><p>20 kr st</p></article>' +
        '<article class="loppis-fynd"><h3>Fåtölj</h3><p>300 kr</p></article>' +
        '<article class="loppis-fynd"><h3>Spegel</h3><p>75 kr</p></article>' +
        '</div>',
      bas:
        ":root { --ram: #b5651d; }\n" +
        ".loppis-fynd { width: 7.5rem; box-sizing: border-box; padding: 0.6rem; background: #fffaf3; border-radius: 6px; }\n" +
        ".loppis-fynd h3 { margin: 0 0 0.2rem; font-size: 1rem; }\n" +
        ".loppis-fynd p { margin: 0; }",
      fore: "",
      start: "",
      efter: "",
      losning:
        ".loppis {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n\n" +
        ".loppis-fynd {\n  border: 2px solid var(--ram);\n}",
      jamfor: ".loppis-fynd",
      stilar: ["border-top-color", "border-top-width", "border-top-style"],
      krav: [
        { pa: ".loppis", egenskap: "flex-wrap" },
        { pa: ".loppis", egenskap: "gap" },
        { pa: ".loppis-fynd", egenskap: "border" },
        { text: /var\(\s*--ram\s*\)/, ledtrad: "Det ser rätt ut, men hämta ramens färg med <code>var(--ram)</code>." }
      ]
    }
  ]);
})();
