/* Övningsbanan, avsnitt Flexbox.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig –
   lägg hellre till en ny nivå än skriver om en gammal. Formatet står i motor.js.

   Scenerna är påhittade och får inte likna referensprojektet (Vikstad) eller
   område 8:s kunder, eftersom provet byggs därifrån. Måtten som eleven måste
   träffa (mellanrum och liknande) står alltid i förklaringen. */

(function () {
  /* Kafé Lyktan – menyn används i de tre första nivåerna. */
  var LYKTAN_HTML =
    '<nav class="lyktan-meny" aria-label="Kaféets meny">' +
    '<a class="lyktan-logga" href="#">Lyktan</a>' +
    '<a href="#">Meny</a><a href="#">Hitta hit</a>' +
    '</nav>';
  var LYKTAN_BAS =
    ".lyktan-meny { background: #3b2a20; padding: 0.75rem 1rem; border-radius: 6px; font-family: Georgia, serif; }\n" +
    ".lyktan-meny a { display: block; color: #f6e9d7; text-decoration: none; }\n" +
    ".lyktan-logga { font-weight: 700; font-size: 1.25rem; }";

  /* Väderkollen – en väderapp. */
  var VADER_HTML =
    '<div class="vader-dag">' +
    '<span class="vader-sol"></span>' +
    '<span class="vader-grader">14°</span>' +
    '<span class="vader-text">Sol hela dagen</span>' +
    '</div>';
  var VADER_BAS =
    ".vader-dag { display: flex; gap: 0.5rem; background: #e8f1fb; color: #17324d; padding: 1rem; border-radius: 10px; }\n" +
    ".vader-sol { display: block; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #f5b82e; }\n" +
    ".vader-grader { font-size: 1.6rem; font-weight: 700; }\n" +
    ".vader-text { background: #ffffff; padding: 0.2rem 0.5rem; border-radius: 4px; }";

  /* Garnboden – en garnbutik. */
  var GARN_LILA = "#6a2c5b";

  Ovningsbana.lagg("flexbox", [
    {
      id: "flex-display-1",
      rubrik: "Menyn på rad",
      typ: "andra",
      forklaring:
        "<p>Kafé Lyktan har en meny där loggan och länkarna står under varandra. " +
        "De ska stå på en rad.</p>" +
        "<p>Använd <code>display: flex</code> på menyn. Då blir menyn en " +
        "flexbehållare, och barnen ställer sig på rad längs huvudaxeln, som " +
        "går åt höger om inget annat sägs.</p>",
      html: LYKTAN_HTML,
      bas: LYKTAN_BAS,
      fore: ".lyktan-meny {\n",
      start: "",
      efter: "}",
      losning: "  display: flex;",
      jamfor: ".lyktan-meny > *",
      krav: [{ pa: ".lyktan-meny", egenskap: "display", varde: /flex/ }]
    },
    {
      id: "flex-gap-1",
      rubrik: "Luft mellan länkarna",
      typ: "andra",
      forklaring:
        "<p>Nu står menyn på rad, men allt sitter ihop. Det behövs " +
        "<b>1.5rem</b> mellanrum mellan varje del.</p>" +
        "<p>Använd <code>gap</code>. Den sätter mellanrum mellan barnen i en " +
        "flexbehållare – bara mellan dem, aldrig ytterst.</p>",
      html: LYKTAN_HTML,
      bas: LYKTAN_BAS,
      fore: ".lyktan-meny {\n  display: flex;\n",
      start: "",
      efter: "}",
      losning: "  gap: 1.5rem;",
      jamfor: ".lyktan-meny > *",
      krav: [{ pa: ".lyktan-meny", egenskap: "gap" }]
    },
    {
      id: "flex-justify-1",
      rubrik: "Fördela menyn",
      typ: "andra",
      forklaring:
        "<p>Allt ligger hopträngt till vänster. Loggan ska stå längst till " +
        "vänster, sista länken längst till höger och resten fördelas jämnt " +
        "emellan.</p>" +
        "<p>Använd <code>justify-content</code>. Den bestämmer hur barnen " +
        "fördelas längs huvudaxeln. Värdet du söker lägger allt överblivet " +
        "utrymme <i>mellan</i> barnen.</p>",
      html: LYKTAN_HTML,
      bas: LYKTAN_BAS,
      fore: ".lyktan-meny {\n  display: flex;\n",
      start: "",
      efter: "}",
      losning: "  justify-content: space-between;",
      jamfor: ".lyktan-meny > *",
      krav: [{ pa: ".lyktan-meny", egenskap: "justify-content", varde: /space-between/ }]
    },
    {
      id: "flex-justify-2",
      rubrik: "Knapparna till höger",
      typ: "andra",
      forklaring:
        "<p>En receptsajt frågar om du vill spara. Knapparna ska stå längst " +
        "till höger, som i de flesta dialogrutor. Någon har skrivit fel värde.</p>" +
        "<p>Rätta raden med <code>justify-content</code>. Huvudaxeln börjar till " +
        "vänster och slutar till höger – vilket värde lägger barnen vid slutet?</p>",
      html:
        '<div class="recept-dialog">' +
        '<p class="recept-fraga">Vill du spara ändringarna i receptet?</p>' +
        '<div class="recept-knappar"><button type="button">Avbryt</button>' +
        '<button type="button" class="recept-spara">Spara</button></div>' +
        '</div>',
      bas:
        ".recept-dialog { background: #fffaf2; border: 1px solid #e0d2bd; border-radius: 10px; padding: 1rem; }\n" +
        ".recept-fraga { margin: 0 0 1rem; }\n" +
        ".recept-knappar { display: flex; gap: 0.5rem; }\n" +
        ".recept-knappar button { font: inherit; padding: 0.4rem 0.9rem; border-radius: 6px; border: 1px solid #b4532a; background: #ffffff; color: #b4532a; }\n" +
        ".recept-knappar .recept-spara { background: #b4532a; color: #ffffff; }",
      fore: ".recept-knappar {\n",
      start: "  justify-content: flex-start;",
      efter: "\n}",
      losning: "  justify-content: flex-end;",
      jamfor: ".recept-knappar button",
      felvag: "  justify-content: flex-start;\n  width: fit-content;\n  margin-left: auto;",
      krav: [{ pa: ".recept-knappar", egenskap: "justify-content", varde: /end/ }]
    },
    {
      id: "flex-justify-3",
      rubrik: "Sidnumrering i mitten",
      typ: "skriv",
      forklaring:
        "<p>Under en lista med recept finns sidnumreringen. Siffrorna ska stå på " +
        "en rad, i mitten, med <b>0.5rem</b> mellanrum.</p>" +
        "<p>Nu skriver du hela regeln själv. Gör <code>.sidor</code> till en " +
        "flexbehållare och använd <code>justify-content</code> för att centrera.</p>",
      html:
        '<nav class="sidor" aria-label="Sidor">' +
        '<a href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a>' +
        '</nav>',
      bas:
        ".sidor a { display: block; width: 2rem; line-height: 2rem; text-align: center; border: 1px solid #c9c3b8; border-radius: 4px; color: #3a3226; text-decoration: none; }",
      fore: "",
      start: ".sidor {\n\n}",
      efter: "",
      losning: ".sidor {\n  display: flex;\n  justify-content: center;\n  gap: 0.5rem;\n}",
      jamfor: ".sidor a",
      felvag: ".sidor {\n  display: flex;\n  gap: 0.5rem;\n  width: fit-content;\n  margin: 0 auto;\n}",
      krav: [{ pa: ".sidor", egenskap: "justify-content", varde: /center/ }]
    },
    {
      id: "flex-align-1",
      rubrik: "Länkarna mitt på höjden",
      typ: "andra",
      forklaring:
        "<p>Garnbodens logga är hög, och länkarna har sträckts ut till samma " +
        "höjd så att texten hamnar högst upp. Länkarna ska stå mitt på höjden.</p>" +
        "<p>Använd <code>align-items</code>. Den styr barnen längs " +
        "tväraxeln – i en rad är det höjdled. Från början är värdet " +
        "<code>stretch</code>, som sträcker ut barnen.</p>",
      html:
        '<header class="garn-huvud">' +
        '<span class="garn-logga">Garnboden</span>' +
        '<a href="#">Garn</a><a href="#">Kurser</a>' +
        '</header>',
      bas:
        ".garn-huvud { display: flex; gap: 0.75rem; background: #f6edf3; padding: 0.4rem 0.75rem; }\n" +
        ".garn-logga { font-family: Georgia, serif; font-size: 1.6rem; font-weight: 700; color: " + GARN_LILA + "; }\n" +
        ".garn-huvud a { color: " + GARN_LILA + "; background: #ffffff; padding: 0 0.3rem; }",
      fore: ".garn-huvud {\n",
      start: "",
      efter: "}",
      losning: "  align-items: center;",
      jamfor: ".garn-huvud > *",
      krav: [{ pa: ".garn-huvud", egenskap: "align-items", varde: /center/ }]
    },
    {
      id: "flex-align-2",
      rubrik: "Profilraden",
      typ: "skriv",
      forklaring:
        "<p>En blogg visar vem som skrivit inlägget: en rund bild och namnet " +
        "bredvid. Bilden och texten ska stå på rad, mitt på höjden, med " +
        "<b>1rem</b> mellanrum.</p>" +
        "<p>Skriv regeln för <code>.profil</code>. Använd <code>align-items</code> " +
        "för höjden och <code>gap</code> för mellanrummet.</p>",
      html:
        '<div class="profil">' +
        '<span class="profil-bild">AK</span>' +
        '<div><p class="profil-namn">Alva Karlsson</p><p class="profil-roll">Bakar surdeg och skriver om det</p></div>' +
        '</div>',
      bas:
        ".profil p { margin: 0; }\n" +
        ".profil-bild { display: block; width: 3.5rem; height: 3.5rem; border-radius: 50%; background: #c6dfd0; color: #1f4b33; line-height: 3.5rem; text-align: center; font-weight: 700; }\n" +
        ".profil-namn { font-weight: 700; }\n" +
        ".profil-roll { color: #5b6660; font-size: 0.9rem; }",
      fore: "",
      start: ".profil {\n\n}",
      efter: "",
      losning: ".profil {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}",
      jamfor: ".profil > *",
      krav: [
        { pa: ".profil", egenskap: "align-items", varde: /center/ },
        { pa: ".profil", egenskap: "gap" }
      ]
    },
    {
      id: "flex-direction-1",
      rubrik: "Dagens väder i en kolumn",
      typ: "andra",
      forklaring:
        "<p>Väderkollen visar dagens väder på en rad, men i appen ska solen, " +
        "graderna och texten stå under varandra.</p>" +
        "<p>Använd <code>flex-direction</code>. Den vrider huvudaxeln: med " +
        "<code>column</code> går den nedåt i stället för åt höger.</p>",
      html: VADER_HTML,
      bas: VADER_BAS,
      fore: ".vader-dag {\n",
      start: "",
      efter: "}",
      losning: "  flex-direction: column;",
      jamfor: ".vader-dag > *",
      krav: [{ pa: ".vader-dag", egenskap: "flex-direction", varde: /column/ }]
    },
    {
      id: "flex-direction-2",
      rubrik: "Sidomenyn",
      typ: "skriv",
      forklaring:
        "<p>En att göra-app har en meny i kanten. Länkarna ska stå under " +
        "varandra med <b>0.75rem</b> mellanrum.</p>" +
        "<p>Skriv regeln för <code>.app-meny</code>. Gör den till en " +
        "flexbehållare, använd <code>flex-direction</code> för att ställa " +
        "länkarna i en kolumn och <code>gap</code> för mellanrummet.</p>",
      html:
        '<nav class="app-meny" aria-label="Appens meny">' +
        '<a href="#">Översikt</a> <a href="#">Mina listor</a> <a href="#">Delade</a> <a href="#">Inställningar</a>' +
        '</nav>',
      bas:
        ".app-meny { background: #22303f; padding: 1rem; width: 12rem; border-radius: 8px; }\n" +
        ".app-meny a { color: #ffffff; text-decoration: none; }",
      fore: "",
      start: ".app-meny {\n\n}",
      efter: "",
      losning: ".app-meny {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}",
      jamfor: ".app-meny a",
      krav: [
        { pa: ".app-meny", egenskap: "flex-direction", varde: /column/ },
        { pa: ".app-meny", egenskap: "gap" }
      ]
    },
    {
      id: "flex-axlar-1",
      rubrik: "Axlarna har bytt plats",
      typ: "andra",
      forklaring:
        "<p>Väderkortet står i en kolumn. Nu ska solen, graderna och texten " +
        "centreras i sidled. Någon har försökt med <code>justify-content</code>, " +
        "men ingenting händer.</p>" +
        "<p>När <code>flex-direction</code> är <code>column</code> går " +
        "huvudaxeln nedåt. Sidled är då <i>tväraxeln</i>. Rätta raden och " +
        "använd <code>align-items</code>.</p>",
      html: VADER_HTML,
      bas: VADER_BAS,
      fore: ".vader-dag {\n  flex-direction: column;\n",
      start: "  justify-content: center;",
      efter: "\n}",
      losning: "  align-items: center;",
      jamfor: ".vader-dag > *",
      felvag: "  align-items: stretch;\n}\n.vader-dag > * {\n  margin: 0 auto;",
      krav: [{ pa: ".vader-dag", egenskap: "align-items", varde: /center/ }]
    },
    {
      id: "flex-wrap-1",
      rubrik: "Etiketterna rinner över",
      typ: "andra",
      forklaring:
        "<p>Garnboden märker garnet med etiketter. Rutan är smal, och " +
        "etiketterna rinner ut över kanten. De ska fortsätta på en ny rad " +
        "när platsen tar slut.</p>" +
        "<p>Använd <code>flex-wrap</code>. Från början är värdet " +
        "<code>nowrap</code>: alla barn trängs på en rad, hur många de än är.</p>",
      html:
        '<ul class="garn-taggar">' +
        '<li>ull</li><li>alpacka</li><li>bomull</li><li>handfärgat</li>' +
        '<li>sockgarn</li><li>mohair</li><li>tjockt</li><li>mjukt</li>' +
        '</ul>',
      bas:
        ".garn-taggar { list-style: none; margin: 0; padding: 0.75rem; display: flex; gap: 0.5rem; width: 12rem; border: 2px dashed #c9a9c0; }\n" +
        ".garn-taggar li { background: " + GARN_LILA + "; color: #ffffff; padding: 0.2rem 0.7rem; border-radius: 999px; white-space: nowrap; }",
      fore: ".garn-taggar {\n",
      start: "",
      efter: "}",
      losning: "  flex-wrap: wrap;",
      jamfor: ".garn-taggar li",
      krav: [{ pa: ".garn-taggar", egenskap: "flex-wrap", varde: /^wrap/ }]
    },
    {
      id: "flex-wrap-2",
      rubrik: "Hyllan med garn",
      typ: "skriv",
      forklaring:
        "<p>Garnbodens varor ska stå på rad, fortsätta på nästa rad när platsen " +
        "tar slut, ha <b>1rem</b> mellanrum åt alla håll och stå i mitten.</p>" +
        "<p>Skriv regeln för <code>.garn-hylla</code>. Du behöver " +
        "<code>flex-wrap</code>, <code>gap</code> och <code>justify-content</code>. " +
        "Kortens bredd är redan satt.</p>",
      html:
        '<div class="garn-hylla">' +
        '<article class="garn-vara"><h3>Ullgarn</h3><p>59 kr</p></article>' +
        '<article class="garn-vara"><h3>Alpacka</h3><p>89 kr</p></article>' +
        '<article class="garn-vara"><h3>Bomull</h3><p>45 kr</p></article>' +
        '<article class="garn-vara"><h3>Mohair</h3><p>99 kr</p></article>' +
        '<article class="garn-vara"><h3>Sockgarn</h3><p>69 kr</p></article>' +
        '</div>',
      bas:
        ".garn-vara { width: 8rem; box-sizing: border-box; background: #ffffff; border: 1px solid #d9c9d6; border-radius: 8px; padding: 0.6rem; }\n" +
        ".garn-vara h3 { margin: 0 0 0.3rem; font-size: 1rem; color: " + GARN_LILA + "; }\n" +
        ".garn-vara p { margin: 0; }",
      fore: "",
      start: ".garn-hylla {\n\n}",
      efter: "",
      losning: ".garn-hylla {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  justify-content: center;\n}",
      jamfor: ".garn-vara",
      krav: [
        { pa: ".garn-hylla", egenskap: "flex-wrap", varde: /^wrap/ },
        { pa: ".garn-hylla", egenskap: "gap" },
        { pa: ".garn-hylla", egenskap: "justify-content", varde: /center/ }
      ]
    },
    {
      id: "flex-1-1",
      rubrik: "Sökfältet tar resten",
      typ: "andra",
      forklaring:
        "<p>Receptsajtens sökrad står redan på rad. Fältet ska ta all plats " +
        "som blir över, medan ordet och knappen bara är så breda som de behöver.</p>" +
        "<p>Använd <code>flex: 1</code> på fältet. Det betyder: väx och ta din " +
        "del av det lediga utrymmet. Är du ensam om det får du allt.</p>",
      html:
        '<form class="recept-sok">' +
        '<label for="receptsok">Sök</label>' +
        '<input id="receptsok" type="search" size="6" placeholder="Recept">' +
        '<button type="button">Sök</button>' +
        '</form>',
      bas:
        ".recept-sok { display: flex; gap: 0.5rem; align-items: center; background: #fffaf2; padding: 0.75rem; border-radius: 8px; }\n" +
        ".recept-sok input { font: inherit; padding: 0.4rem; border: 1px solid #b9a98f; border-radius: 4px; }\n" +
        ".recept-sok button { font: inherit; padding: 0.4rem 0.9rem; border: 0; border-radius: 4px; background: #b4532a; color: #ffffff; }",
      fore: ".recept-sok input {\n",
      start: "",
      efter: "}",
      losning: "  flex: 1;",
      jamfor: ".recept-sok > *",
      felvag: ["  width: 100%;", "  width: 100%;\n  flex-wrap: wrap;"],
      krav: [{ pa: ".recept-sok input", egenskap: "flex", varde: /^\s*[1-9]/ }]
    },
    {
      id: "flex-1-2",
      rubrik: "Tre lika breda paket",
      typ: "skriv",
      forklaring:
        "<p>En app säljer tre prispaket som står på rad. Paketen är olika breda " +
        "eftersom texten i dem är olika lång. De ska vara exakt lika breda.</p>" +
        "<p>Skriv en regel för <code>.pris-paket</code> och använd " +
        "<code>flex: 1</code>. När alla barn har samma värde delar de lika på " +
        "raden.</p>",
      html:
        '<div class="pris-rad">' +
        '<section class="pris-paket"><h3>Bas</h3><p>0 kr</p></section>' +
        '<section class="pris-paket"><h3>Plus</h3><p>49 kr</p><p>Utan reklam</p></section>' +
        '<section class="pris-paket"><h3>Familj</h3><p>89 kr</p></section>' +
        '</div>',
      bas:
        ".pris-rad { display: flex; gap: 0.5rem; }\n" +
        ".pris-paket { background: #f2f6fa; border: 1px solid #c4d3e2; border-radius: 8px; padding: 0.5rem; }\n" +
        ".pris-paket h3 { margin: 0 0 0.3rem; font-size: 1.05rem; color: #1d4a74; }\n" +
        ".pris-paket p { margin: 0; font-size: 0.9rem; }",
      fore: "",
      start: "",
      efter: "",
      losning: ".pris-paket {\n  flex: 1;\n}",
      jamfor: ".pris-paket",
      felvag: ".pris-paket {\n  flex: 0 0 auto;\n  box-sizing: border-box;\n  width: calc((100% - 1rem) / 3);\n}",
      krav: [{ pa: ".pris-paket", egenskap: "flex", varde: /^\s*[1-9]/ }]
    },
    {
      id: "flex-kombo-1",
      rubrik: "Ett helt sidhuvud",
      typ: "skriv",
      forklaring:
        "<p>Keramikstudion Lera behöver ett sidhuvud. Loggan ska stå längst " +
        "till vänster, menyn längst till höger, och båda ska stå mitt på höjden.</p>" +
        "<p>Skriv regeln för <code>.lera-huvud</code> helt själv. Du behöver tre " +
        "egenskaper: en som gör flexbehållaren, <code>justify-content</code> " +
        "och <code>align-items</code>.</p>",
      html:
        '<header class="lera-huvud">' +
        '<a class="lera-logga" href="#">Lera</a>' +
        '<nav aria-label="Huvudmeny"><a href="#">Kurser</a> <a href="#">Butik</a> <a href="#">Om oss</a></nav>' +
        '</header>',
      bas:
        ".lera-huvud { background: #efe4da; padding: 0.5rem 1rem; }\n" +
        ".lera-logga { font-family: Georgia, serif; font-size: 2rem; font-weight: 700; color: #7a3e1d; text-decoration: none; }\n" +
        ".lera-huvud nav a { color: #7a3e1d; margin-left: 1rem; }",
      fore: "",
      start: ".lera-huvud {\n\n}",
      efter: "",
      losning: ".lera-huvud {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}",
      jamfor: ".lera-huvud > *",
      krav: [
        { pa: ".lera-huvud", egenskap: "justify-content", varde: /space-between/ },
        { pa: ".lera-huvud", egenskap: "align-items", varde: /center/ }
      ]
    }
  ]);
})();
