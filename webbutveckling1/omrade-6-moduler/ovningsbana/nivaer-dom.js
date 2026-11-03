/* Övningsbanan område 6, avsnittet Hitta och ändra.

   Varje nivå har ett fast id. Framstegen sparas under det, så ett id byts aldrig. */

(function () {
  function k() { return Array.prototype.slice.call(arguments).join("\n"); }

  var SKYLT =
    ".skylt { max-width: 14rem; padding: 0.8rem 1rem; border: 3px solid #6b3e1f; border-radius: 8px; background: #fdf6ec; text-align: center; }\n" +
    ".skylt h3 { margin: 0 0 0.3rem; font-size: 1rem; color: #6b3e1f; }\n" +
    ".skylt p { margin: 0; font-size: 1.4rem; font-weight: 700; }";

  Ovningsbana.lagg("dom", [
    {
      id: "js-dom-1",
      sprak: "js",
      rubrik: "Dagens öppettider",
      typ: "andra",
      forklaring:
        "<p>Bageriet Vete och Råg har en skylt på sin sajt. Idag har de öppet " +
        "<b>07–18</b>, men skylten säger Stängt.</p>" +
        "<p>Elementet är redan hittat med <code>querySelector</code>. Sätt dess text med " +
        "<code>textContent</code>.</p>",
      html: '<section class="skylt"><h3>Öppet idag</h3><p class="skylt-tid">Stängt</p></section>',
      bas: SKYLT,
      start: k(
        'const tid = document.querySelector(".skylt-tid");',
        "",
        ""),
      losning: k(
        'const tid = document.querySelector(".skylt-tid");',
        "",
        'tid.textContent = "07–18";'),
      felvag: k(
        'const tid = document.querySelector(".skylt-tid");',
        "",
        'tid.innerHTML = "07–18";'),
      krav: [{
        text: /tid\.textContent\s*=/,
        ledtrad: "Det ser rätt ut, men nivån övar <code>textContent</code>. Den visar text som text – <code>innerHTML</code> tolkar den som HTML."
      }]
    },
    {
      id: "js-dom-2",
      sprak: "js",
      rubrik: "Visa erbjudandet",
      typ: "andra",
      forklaring:
        "<p>Erbjudandet har attributet <code>hidden</code> i HTML:en, så att det inte syns " +
        "om JavaScript inte körs. Koden ska visa det, men gömmer det i stället.</p>" +
        "<p>Ändra raden så att erbjudandet syns. Använd <code>hidden</code>, som modulerna gör.</p>",
      html:
        '<p class="erbjudande" hidden>Halva priset på allt bröd efter klockan 17.</p>' +
        '<p class="valkommen">Välkommen in till Vete och Råg.</p>',
      bas:
        ".erbjudande { margin: 0 0 0.6rem; padding: 0.6rem 0.8rem; border-radius: 6px; background: #fde68a; font-weight: 700; }\n" +
        ".valkommen { margin: 0; }",
      start: k(
        'const erbjudande = document.querySelector(".erbjudande");',
        "",
        "erbjudande.hidden = true;"),
      losning: k(
        'const erbjudande = document.querySelector(".erbjudande");',
        "",
        "erbjudande.hidden = false;"),
      felvag: k(
        'const erbjudande = document.querySelector(".erbjudande");',
        "",
        'erbjudande.style.display = "block";'),
      krav: [{
        text: /erbjudande\.hidden\s*=\s*false|removeAttribute\(\s*["']hidden["']\s*\)/,
        ledtrad: "Det syns, men nivån övar <code>hidden</code>. Sätt <code>erbjudande.hidden</code> till <code>false</code>."
      }]
    },
    {
      id: "js-dom-3",
      sprak: "js",
      rubrik: "Märk alla nyheter",
      typ: "skriv",
      forklaring:
        "<p>Tre bröd är nya i veckan. Varje nytt bröd har en etikett med " +
        "<code>hidden</code>. <code>querySelectorAll</code> har redan hittat alla " +
        "etiketter.</p>" +
        "<p>Gå igenom listan <code>nya</code> med <code>forEach</code> och visa varje " +
        "etikett.</p>",
      html:
        '<ul class="brod">' +
        '<li>Surdegslimpa <span class="ny" hidden>Ny</span></li>' +
        '<li>Kardemummaknut</li>' +
        '<li>Rågkaka <span class="ny" hidden>Ny</span></li>' +
        '<li>Fröbröd <span class="ny" hidden>Ny</span></li>' +
        '</ul>',
      bas:
        ".brod { margin: 0; padding: 0; list-style: none; }\n" +
        ".brod li { padding: 0.4rem 0; border-bottom: 1px solid #e5d9c8; }\n" +
        ".ny { margin-left: 0.4rem; padding: 0.1rem 0.45rem; border-radius: 999px; background: #166534; color: #ffffff; font-size: 0.75rem; font-weight: 700; }",
      fore: k(
        'const nya = document.querySelectorAll(".ny");',
        "",
        ""),
      start: "",
      losning: k(
        "nya.forEach(function (ny) {",
        "  ny.hidden = false;",
        "});"),
      felvag: k(
        "nya[0].hidden = false;",
        "nya[1].hidden = false;",
        "nya[2].hidden = false;"),
      krav: [{
        text: /\.forEach\(|for\s*\(/,
        ledtrad: "Det ser rätt ut, men det slutar stämma när det kommer ett fjärde nytt bröd. Gå igenom <code>nya</code> med <code>forEach</code>."
      }]
    }
  ], "Hitta och ändra");
})();
