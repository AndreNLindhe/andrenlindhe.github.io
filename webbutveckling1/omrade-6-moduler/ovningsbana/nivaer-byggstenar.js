/* Övningsbanan område 6, avsnittet Byggstenarna.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig.
   Formatet står i motor.js. Scenerna är påhittade och får inte likna
   referensprojektet (Vikstads naturreservat), demosidorna (Tallbacka ridklubb)
   eller område 8:s kunder. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  Ovningsbana.lagg("byggstenar", [
    {
      id: "js-const-1",
      sprak: "js",
      utskrift: true,
      rubrik: "Biljettpriset",
      typ: "andra",
      forklaring:
        "<p>Biografen Rutan skriver ut sina priser i konsolen. Barnbiljetten kostar " +
        "<b>85 kr</b>, men koden säger något annat.</p>" +
        "<p>Ändra värdet i variabeln <code>PRIS_BARN</code>. Raderna med " +
        "<code>console.log</code> ska stå kvar som de är – de hämtar priset ur variabeln.</p>",
      start: k(
        "const PRIS_VUXEN = 120;",
        "const PRIS_BARN = 120;",
        "",
        'console.log("Vuxen: " + PRIS_VUXEN + " kr");',
        'console.log("Barn: " + PRIS_BARN + " kr");'),
      losning: k(
        "const PRIS_VUXEN = 120;",
        "const PRIS_BARN = 85;",
        "",
        'console.log("Vuxen: " + PRIS_VUXEN + " kr");',
        'console.log("Barn: " + PRIS_BARN + " kr");'),
      felvag: k(
        "const PRIS_VUXEN = 120;",
        "const PRIS_BARN = 120;",
        "",
        'console.log("Vuxen: " + PRIS_VUXEN + " kr");',
        'console.log("Barn: 85 kr");'),
      krav: [{
        text: /PRIS_BARN\s*=\s*85\b/,
        ledtrad: "Rätt utskrift, men priset ska ändras i variabeln <code>PRIS_BARN</code>, inte skrivas direkt i texten."
      }]
    },
    {
      id: "js-let-1",
      sprak: "js",
      utskrift: true,
      rubrik: "Platser kvar",
      typ: "andra",
      forklaring:
        "<p>Kassan räknar sålda biljetter. Kör koden och läs felet: en " +
        "<code>const</code> får inte få ett nytt värde.</p>" +
        "<p>Byt till rätt sorts variabel för ett värde som ändras. Utskriften ska " +
        "bli <b>Sålda: 5</b> och <b>Kvar: 35</b>.</p>",
      start: k(
        "const PLATSER = 40;",
        "const salda = 0;",
        "",
        "salda = salda + 3;",
        "salda = salda + 2;",
        "",
        'console.log("Sålda: " + salda);',
        'console.log("Kvar: " + (PLATSER - salda));'),
      losning: k(
        "const PLATSER = 40;",
        "let salda = 0;",
        "",
        "salda = salda + 3;",
        "salda = salda + 2;",
        "",
        'console.log("Sålda: " + salda);',
        'console.log("Kvar: " + (PLATSER - salda));'),
      felvag: k(
        "const PLATSER = 40;",
        "const salda = 5;",
        "",
        'console.log("Sålda: " + salda);',
        'console.log("Kvar: " + (PLATSER - salda));'),
      krav: [{
        text: /let\s+salda\b/,
        ledtrad: "Rätt utskrift, men räkningen ska stå kvar. Gör <code>salda</code> till en <code>let</code> i stället."
      }]
    },
    {
      id: "js-funktion-1",
      sprak: "js",
      utskrift: true,
      rubrik: "Välkomna gästerna",
      typ: "andra",
      forklaring:
        "<p>Funktionen <code>valkomna</code> skriver en hälsning till en gäst. Den " +
        "anropas en gång, för Sara.</p>" +
        "<p>Anropa den två gånger till, för <b>Omar</b> och för <b>Li</b>, i den " +
        "ordningen. Skriv inga nya <code>console.log</code> – låt funktionen göra jobbet.</p>",
      fore: k(
        "function valkomna(namn) {",
        '  console.log("Välkommen till Rutan, " + namn + ".");',
        "}",
        "",
        ""),
      start: 'valkomna("Sara");',
      losning: k(
        'valkomna("Sara");',
        'valkomna("Omar");',
        'valkomna("Li");'),
      felvag: k(
        'valkomna("Sara");',
        'console.log("Välkommen till Rutan, Omar.");',
        'console.log("Välkommen till Rutan, Li.");'),
      krav: [{
        text: /valkomna\(\s*["']Omar["']\s*\)[\s\S]*valkomna\(\s*["']Li["']\s*\)/,
        ledtrad: "Rätt utskrift, men nivån övar att anropa en funktion. Skriv <code>valkomna(\"Omar\");</code> och samma för Li."
      }]
    },
    {
      id: "js-villkor-1",
      sprak: "js",
      utskrift: true,
      rubrik: "Barn eller vuxen",
      typ: "andra",
      forklaring:
        "<p>Rutan har ändrat reglerna: barnbiljetten gäller nu <b>till och med 11 år</b>. " +
        "Funktionen avgör priset med ett <code>if</code>, men villkoret säger fortfarande " +
        "under 8.</p>" +
        "<p>Ändra villkoret så att det gäller alla åldrar upp till och med 11, inte bara " +
        "de tre som provas här.</p>",
      fore: k(
        "const PRIS_VUXEN = 120;",
        "const PRIS_BARN = 85;",
        "",
        ""),
      start: k(
        "function skrivPris(alder) {",
        "  if (alder < 8) {",
        '    console.log(alder + " år: " + PRIS_BARN + " kr");',
        "  } else {",
        '    console.log(alder + " år: " + PRIS_VUXEN + " kr");',
        "  }",
        "}"),
      efter: k(
        "",
        "",
        "skrivPris(7);",
        "skrivPris(11);",
        "skrivPris(12);"),
      losning: k(
        "function skrivPris(alder) {",
        "  if (alder <= 11) {",
        '    console.log(alder + " år: " + PRIS_BARN + " kr");',
        "  } else {",
        '    console.log(alder + " år: " + PRIS_VUXEN + " kr");',
        "  }",
        "}"),
      felvag: k(
        "function skrivPris(alder) {",
        "  if (alder === 7 || alder === 11) {",
        '    console.log(alder + " år: " + PRIS_BARN + " kr");',
        "  } else {",
        '    console.log(alder + " år: " + PRIS_VUXEN + " kr");',
        "  }",
        "}"),
      krav: [{
        text: /alder\s*(<=\s*11|<\s*12)\b/,
        ledtrad: "Det stämmer för de här tre åldrarna, men inte för en tioåring. Jämför med <code>&lt;=</code> eller <code>&lt;</code> så att villkoret gäller alla barn."
      }]
    },
    {
      id: "js-loop-1",
      sprak: "js",
      utskrift: true,
      rubrik: "Kvällens filmer",
      typ: "skriv",
      forklaring:
        "<p>Kvällens filmer ligger i en lista. Skriv ut varje film på en egen rad.</p>" +
        "<p>Använd <code>forEach</code>, så att koden fortsätter fungera när listan får " +
        "fler filmer.</p>",
      fore: k(
        'const filmer = ["Havets ljus", "Snöstormen", "Kometen"];',
        "",
        ""),
      start: "",
      losning: k(
        "filmer.forEach(function (film) {",
        "  console.log(film);",
        "});"),
      felvag: k(
        'console.log("Havets ljus");',
        'console.log("Snöstormen");',
        'console.log("Kometen");'),
      krav: [{
        text: /\.forEach\(|for\s*\(/,
        ledtrad: "Rätt utskrift, men den slutar stämma när listan ändras. Gå igenom <code>filmer</code> med <code>forEach</code>."
      }]
    }
  ], "Byggstenarna");
})();
