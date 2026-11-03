/* Övningsbanan område 6, avsnittet Koppla in.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   HTML-nivåer: skript i elevens HTML körs inte och hämtas inte, så script-taggen
   rättas på hur den är skriven – sökväg och defer. Om filen sedan hittas övas i
   projektet, med konsolen och fliken Network. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  Ovningsbana.lagg("koppla-in", [
    {
      id: "js-koppla-1",
      sprak: "html",
      utseende: false,
      rubrik: "Script-taggen",
      typ: "skriv",
      forklaring:
        "<p>Cykelköket ska få modulen <code>meny.js</code>. Sidan är " +
        "<code>index.html</code> i sajtens rotmapp, och modulen ligger i mappen " +
        "<code>js</code> bredvid den.</p>" +
        "<p>Skriv <code>script</code>-taggen sist i <code>head</code>. Sökvägen ska vara " +
        "relativ, och taggen ska ha <code>defer</code> så att skriptet väntar tills " +
        "HTML:en finns.</p>",
      fore: k(
        "<!-- index.html, i rotmappen bredvid mappen js -->",
        "<head>",
        '  <meta charset="utf-8">',
        "  <title>Cykelköket</title>",
        ""),
      start: "  ",
      efter: "\n</head>",
      losning: '  <script src="js/meny.js" defer></script>',
      felvag: [
        '  <script src="/js/meny.js" defer></script>',
        '  <script src="js/meny.js"></script>'
      ],
      krav: [
        {
          finns: 'script[src="js/meny.js"], script[src="./js/meny.js"]',
          ledtrad: "Kontrollera <code>src</code>. Sökvägen ska gå från <code>index.html</code> till filen: <code>js/meny.js</code> – utan snedstreck först, det pekar på serverns rot."
        },
        {
          finns: 'script[src="js/meny.js"][defer], script[src="./js/meny.js"][defer]',
          ledtrad: "Sökvägen stämmer. Lägg till <code>defer</code> – annars körs skriptet innan HTML:en finns, och <code>querySelector</code> ger <code>null</code>."
        }
      ]
    },
    {
      id: "js-koppla-2",
      sprak: "html",
      rubrik: "Knappen som kräver skript",
      typ: "andra",
      forklaring:
        "<p>Menyknappen fungerar bara när <code>meny.js</code> körs. Utan skript ska den " +
        "inte synas alls – då visas menyn som en vanlig lista.</p>" +
        "<p>Lägg till attributet <code>hidden</code> på knappen. Modulen tar bort det när " +
        "den startar.</p>",
      bas:
        ".huvudmeny { padding: 0.6rem 0.9rem; background: #1e3a5f; }\n" +
        ".menyknapp { font: inherit; padding: 0.3rem 0.8rem; border: 2px solid #ffffff; border-radius: 6px; background: transparent; color: #ffffff; }\n" +
        "#huvudmeny-lista { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; margin: 0; padding: 0; list-style: none; }\n" +
        ".menyknapp + #huvudmeny-lista { margin-top: 0.5rem; }\n" +
        ".huvudmeny a { color: #ffffff; }",
      start: k(
        '<nav class="huvudmeny" aria-label="Huvudmeny">',
        '  <button type="button" class="menyknapp" aria-expanded="false">Meny</button>',
        '  <ul id="huvudmeny-lista">',
        '    <li><a href="#">Verkstan</a></li>',
        '    <li><a href="#">Boka tid</a></li>',
        '    <li><a href="#">Hitta hit</a></li>',
        "  </ul>",
        "</nav>"),
      losning: k(
        '<nav class="huvudmeny" aria-label="Huvudmeny">',
        '  <button type="button" class="menyknapp" aria-expanded="false" hidden>Meny</button>',
        '  <ul id="huvudmeny-lista">',
        '    <li><a href="#">Verkstan</a></li>',
        '    <li><a href="#">Boka tid</a></li>',
        '    <li><a href="#">Hitta hit</a></li>',
        "  </ul>",
        "</nav>"),
      felvag: k(
        '<nav class="huvudmeny" aria-label="Huvudmeny">',
        '  <button type="button" class="menyknapp" aria-expanded="false" style="display: none">Meny</button>',
        '  <ul id="huvudmeny-lista">',
        '    <li><a href="#">Verkstan</a></li>',
        '    <li><a href="#">Boka tid</a></li>',
        '    <li><a href="#">Hitta hit</a></li>',
        "  </ul>",
        "</nav>"),
      krav: [{
        finns: "button.menyknapp[hidden]",
        ledtrad: "Den syns inte, men nivån övar <code>hidden</code>. Modulen visar knappen med <code>knapp.hidden = false</code> – det fungerar inte på en <code>style</code>."
      }]
    }
  ], "Koppla in");
})();
