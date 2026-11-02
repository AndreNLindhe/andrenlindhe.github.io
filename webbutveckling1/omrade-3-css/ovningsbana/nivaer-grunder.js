/* Övningsbanan, avsnitten Selektorer, Boxmodellen, Färg och Typografi.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Formatet står i motor.js. Scenerna är påhittade och får inte likna
   referensprojektet (Vikstad) eller område 8:s kunder. */

(function () {
  /* ---------------- Selektorer ---------------- */

  Ovningsbana.lagg("selektorer", [
    {
      id: "sel-klass-1",
      rubrik: "Bara en knapp",
      typ: "andra",
      forklaring:
        "<p>Ett anmälningsformulär har två knappar. Regeln gör båda blå, men bara " +
        "<b>Skicka</b> ska vara det. Avbryt ska behålla sitt grå utseende.</p>" +
        "<p>Ändra selektorn. Elementselektorn <code>button</code> träffar alla " +
        "knappar – använd klassen som bara Skicka har. Titta i HTML:en nedanför.</p>",
      html:
        '<div class="anmalan-knappar">' +
        '<button type="button">Avbryt</button>' +
        '<button type="button" class="skicka">Skicka</button>' +
        '</div>',
      bas:
        "button { font: inherit; padding: 0.45rem 1rem; margin-right: 0.5rem; border: 0; border-radius: 6px; background: #e2e5ea; color: #333a45; }",
      fore: "",
      start: "button {\n  background: #2b6cb0;\n  color: #ffffff;\n}",
      efter: "",
      losning: ".skicka {\n  background: #2b6cb0;\n  color: #ffffff;\n}",
      jamfor: "button",
      stilar: ["color", "background-color"],
      visaHtml: true,
      krav: [{
        pa: ".skicka",
        selektor: /\.skicka/,
        ledtrad: "Det ser rätt ut, men nivån övar klasselektorn. Skriv selektorn med <code>.skicka</code>."
      }]
    },
    {
      id: "sel-barn-1",
      rubrik: "Bara huvudlänkarna",
      typ: "andra",
      forklaring:
        "<p>Brädspelsklubbens meny har en undermeny. Regeln gör alla länkar röda och " +
        "feta, men bara huvudlänkarna ska vara det – <b>Spel</b> och <b>Träffar</b>.</p>" +
        "<p>Ändra selektorn med <code>&gt;</code>. Mellanslag betyder <i>någonstans " +
        "inuti</i>, <code>&gt;</code> betyder <i>direkt barn till</i>. Länkarna i " +
        "undermenyn ligger djupare.</p>",
      html:
        '<ul class="spel-meny">' +
        '<li><a href="#">Spel</a><ul><li><a href="#">Strategi</a></li><li><a href="#">Familj</a></li></ul></li>' +
        '<li><a href="#">Träffar</a></li>' +
        '</ul>',
      bas:
        "ul { margin: 0; padding-left: 1.2rem; }\n" +
        "li { margin: 0.2rem 0; }\n" +
        "a { color: #333a45; }",
      fore: "",
      start: ".spel-meny a {\n  color: #b03a2e;\n  font-weight: 700;\n}",
      efter: "",
      losning: ".spel-meny > li > a {\n  color: #b03a2e;\n  font-weight: 700;\n}",
      jamfor: "a",
      stilar: ["color", "font-weight"],
      visaHtml: true,
      krav: [{
        pa: ".spel-meny > li > a",
        selektor: />/,
        ledtrad: "Det ser rätt ut, men nivån övar <code>&gt;</code>. Använd den för att bara träffa direkta barn."
      }]
    },
    {
      id: "sel-rand-1",
      rubrik: "Randig tabell",
      typ: "skriv",
      forklaring:
        "<p>Frågesportligans tabell är svår att läsa rad för rad. Varannan rad i " +
        "tabellens kropp ska få bakgrunden <b>#eef3f8</b>, med start på rad två.</p>" +
        "<p>Skriv en regel med <code>:nth-child(even)</code> på raderna i " +
        "<code>tbody</code>. <code>even</code> betyder jämna: andra, fjärde, sjätte.</p>",
      html:
        '<table class="liga">' +
        '<thead><tr><th>Lag</th><th>Poäng</th></tr></thead>' +
        '<tbody>' +
        '<tr><td>Kunskapskatterna</td><td>42</td></tr>' +
        '<tr><td>Svar ja</td><td>39</td></tr>' +
        '<tr><td>Fel men glada</td><td>35</td></tr>' +
        '<tr><td>Lag Lingon</td><td>31</td></tr>' +
        '<tr><td>Quizzarna</td><td>28</td></tr>' +
        '<tr><td>Sista frågan</td><td>22</td></tr>' +
        '</tbody></table>',
      bas:
        ".liga { border-collapse: collapse; width: 100%; }\n" +
        ".liga th, .liga td { text-align: left; padding: 0.35rem 0.6rem; }\n" +
        ".liga th { border-bottom: 2px solid #1d4a74; }",
      fore: "",
      start: "",
      efter: "",
      losning: ".liga tbody tr:nth-child(even) {\n  background: #eef3f8;\n}",
      jamfor: "tr",
      stilar: ["background-color"],
      krav: [{
        pa: ".liga tbody tr",
        selektor: /:nth-child\(\s*(even|2n)\s*\)/,
        ledtrad: "Det ser rätt ut, men nivån övar <code>:nth-child(even)</code>. Använd den i selektorn."
      }]
    }
  ]);

  /* ---------------- Boxmodellen ---------------- */

  Ovningsbana.lagg("boxmodellen", [
    {
      id: "box-padding-1",
      rubrik: "Luft i rutan",
      typ: "andra",
      forklaring:
        "<p>Konserthusets ruta om kvällens konsert har texten tryckt mot kanten. " +
        "Det ska vara <b>1rem</b> luft upptill och nertill och <b>1.5rem</b> på " +
        "sidorna, <i>innanför</i> ramen.</p>" +
        "<p>Använd <code>padding</code>. Med två värden gäller det första uppe och " +
        "nere, det andra höger och vänster.</p>",
      html:
        '<article class="konsert">' +
        '<h3>Jazz på torget</h3><p>Fredag kl. 19.00 · Fri entré</p>' +
        '</article>',
      bas:
        ".konsert { background: #fff6e5; border: 2px solid #d99a2b; border-radius: 8px; }\n" +
        ".konsert h3 { margin: 0 0 0.3rem; }\n" +
        ".konsert p { margin: 0; }",
      fore: ".konsert {\n",
      start: "",
      efter: "}",
      losning: "  padding: 1rem 1.5rem;",
      jamfor: ".konsert, .konsert > *",
      krav: [{ pa: ".konsert", egenskap: "padding" }]
    },
    {
      id: "box-sizing-1",
      rubrik: "Två halvor som inte får plats",
      typ: "andra",
      forklaring:
        "<p>Två rutor är <code>width: 50%</code> var och ska stå bredvid varandra. " +
        "Men de har också padding och ram, och då blir de bredare än hälften – " +
        "den andra trillar ner på nästa rad.</p>" +
        "<p>Använd <code>box-sizing: border-box</code>. Då räknas padding och ram " +
        "in i bredden i stället för att läggas till.</p>",
      html:
        '<div class="halva">Före: rutorna trillar isär.</div>' +
        '<div class="halva">Efter: de står bredvid varandra.</div>',
      bas:
        ".halva { display: inline-block; vertical-align: top; width: 50%; padding: 1rem; border: 2px solid #3d6b4f; background: #eef6f0; }",
      fore: ".halva {\n",
      start: "",
      efter: "}",
      losning: "  box-sizing: border-box;",
      jamfor: ".halva",
      krav: [{ pa: ".halva", egenskap: "box-sizing" }]
    },
    {
      id: "box-centrera-1",
      rubrik: "Spalten i mitten",
      typ: "skriv",
      forklaring:
        "<p>En artikel blir svår att läsa när raderna är långa. Spalten ska vara " +
        "högst <b>12rem</b> bred och stå i mitten.</p>" +
        "<p>Skriv regeln för <code>.artikel</code> med <code>max-width</code> och " +
        "<code>margin</code>. <code>auto</code> på sidorna delar det lediga " +
        "utrymmet lika.</p>",
      html:
        '<article class="artikel">' +
        '<h3>Så stickar du din första mössa</h3>' +
        '<p>Börja med ett tjockt garn och stora stickor. Då växer mössan fort och du ser direkt om något blir fel.</p>' +
        '</article>',
      bas:
        ".artikel { background: #f7f2fb; padding: 1rem; }\n" +
        ".artikel h3 { margin: 0 0 0.5rem; }\n" +
        ".artikel p { margin: 0; }",
      fore: "",
      start: ".artikel {\n\n}",
      efter: "",
      losning: ".artikel {\n  max-width: 12rem;\n  margin: 0 auto;\n}",
      jamfor: ".artikel, .artikel > *",
      krav: [
        { pa: ".artikel", egenskap: "max-width" },
        {
          pa: ".artikel",
          egenskap: "margin",
          varde: /auto/,
          ledtrad: "Det ser rätt ut, men nivån övar <code>margin</code> med <code>auto</code> på sidorna."
        }
      ]
    }
  ]);

  /* ---------------- Färg ---------------- */

  Ovningsbana.lagg("farg", [
    {
      id: "farg-knapp-1",
      rubrik: "Bokningsknappen",
      typ: "andra",
      forklaring:
        "<p>Restaurangens bokningsknapp är grå och syns knappt. Den ska ha vit " +
        "text, <b>#ffffff</b>, på mörkgrön bakgrund, <b>#1f6f5c</b>.</p>" +
        "<p>Använd <code>color</code> för texten och <code>background</code> för " +
        "ytan bakom.</p>",
      html: '<button type="button" class="boka">Boka bord</button>',
      bas: ".boka { font: inherit; font-weight: 700; padding: 0.6rem 1.2rem; border: 0; border-radius: 6px; }",
      fore: ".boka {\n",
      start: "",
      efter: "}",
      losning: "  color: #ffffff;\n  background: #1f6f5c;",
      jamfor: ".boka",
      stilar: ["color", "background-color"],
      krav: [
        { pa: ".boka", egenskap: "color" },
        { pa: ".boka", egenskap: "background" }
      ]
    },
    {
      id: "farg-hsl-1",
      rubrik: "Färgen i hsl",
      typ: "skriv",
      forklaring:
        "<p>Etiketten <b>Nyhet</b> ska få en blå bakgrund: nyans <b>200</b>, " +
        "mättnad <b>70%</b> och ljushet <b>40%</b>.</p>" +
        "<p>Skriv färgen med <code>hsl()</code>. Den tar nyansen som en vinkel på " +
        "färghjulet, sedan mättnad och ljushet i procent.</p>",
      html: '<p>Höstens kurser <span class="nyhet">Nyhet</span></p>',
      bas: ".nyhet { padding: 0.15rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; }",
      fore: "",
      start: ".nyhet {\n  color: #ffffff;\n\n}",
      efter: "",
      losning: ".nyhet {\n  color: #ffffff;\n  background: hsl(200, 70%, 40%);\n}",
      jamfor: ".nyhet",
      stilar: ["background-color"],
      krav: [{
        text: /hsl\(/,
        ledtrad: "Det ser rätt ut, men nivån övar <code>hsl()</code>. Skriv färgen som nyans, mättnad och ljushet."
      }]
    }
  ]);

  /* ---------------- Typografi ---------------- */

  Ovningsbana.lagg("typografi", [
    {
      id: "typo-stack-1",
      rubrik: "En typsnittsstack",
      typ: "andra",
      forklaring:
        "<p>Citatet använder bara Georgia. Saknas det typsnittet på besökarens " +
        "dator väljer webbläsaren vad som helst. Lägg till <b>Cambria</b> som " +
        "reserv och den generiska familjen <b>serif</b> sist.</p>" +
        "<p>I <code>font-family</code> skriver du flera typsnitt med komma " +
        "emellan. Webbläsaren tar det första som finns.</p>",
      html: '<blockquote class="citat">Det bästa sättet att lära sig är att göra.</blockquote>',
      bas: ".citat { margin: 0; padding-left: 1rem; border-left: 4px solid #a1887f; font-size: 1.2rem; font-style: italic; }",
      fore: ".citat {\n",
      start: "  font-family: Georgia;",
      efter: "\n}",
      losning: "  font-family: Georgia, Cambria, serif;",
      jamfor: ".citat",
      stilar: ["font-family"],
      krav: [{ pa: ".citat", egenskap: "font-family" }]
    },
    {
      id: "typo-rem-1",
      rubrik: "Rubriken i rem",
      typ: "andra",
      forklaring:
        "<p>Bloggrubriken är satt i pixlar och växer inte med när besökaren " +
        "ställer in större text. Den ska vara <b>1.5 gånger</b> rotens " +
        "textstorlek.</p>" +
        "<p>Rätta raden och använd <code>rem</code>. 1rem är rotens storlek, " +
        "oftast 16 pixlar.</p>",
      html: '<h3 class="inlagg-rubrik">Tio saker jag lärt mig om surdeg</h3><p>Publicerad 3 november</p>',
      bas: ".inlagg-rubrik { margin: 0 0 0.3rem; line-height: 1.2; }\np { margin: 0; color: #5b6660; }",
      fore: ".inlagg-rubrik {\n",
      start: "  font-size: 32px;",
      efter: "\n}",
      losning: "  font-size: 1.5rem;",
      jamfor: ".inlagg-rubrik, p",
      stilar: ["font-size"],
      felvag: "  font-size: 24px;",
      krav: [{
        pa: ".inlagg-rubrik",
        egenskap: "font-size",
        varde: /rem/,
        ledtrad: "Det ser rätt ut, men nivån övar <code>rem</code>. Skriv storleken i rem i stället för pixlar."
      }]
    },
    {
      id: "typo-radavstand-1",
      rubrik: "Luft mellan raderna",
      typ: "skriv",
      forklaring:
        "<p>Brödtexten är tät och tung att läsa. Radavståndet ska vara " +
        "<b>1.6</b> gånger textstorleken.</p>" +
        "<p>Skriv regeln för <code>.brodtext</code> med <code>line-height</code> " +
        "och ett tal <i>utan enhet</i>. Då räknas det om för varje element som " +
        "ärver det.</p>",
      html:
        '<p class="brodtext">Surdeg är mjöl och vatten som fått stå tills jästsvampar och ' +
        'mjölksyrabakterier flyttat in. Den lever, och den behöver matas.</p>',
      bas: ".brodtext { margin: 0; max-width: 22rem; }",
      fore: "",
      start: ".brodtext {\n\n}",
      efter: "",
      losning: ".brodtext {\n  line-height: 1.6;\n}",
      jamfor: ".brodtext",
      felvag: ".brodtext {\n  line-height: 1.6em;\n}",
      krav: [{
        pa: ".brodtext",
        egenskap: "line-height",
        varde: /^\d*\.?\d+$/,
        ledtrad: "Det ser rätt ut, men skriv <code>line-height</code> utan enhet, bara talet."
      }]
    }
  ]);
})();
