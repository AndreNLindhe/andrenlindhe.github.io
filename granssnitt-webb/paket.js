/* Elevpaket – gemensamt beteende för alla sidor.
   Ingen sida kräver något av det här för att gå att läsa. Allt nedan är påbyggnad:
   slås JavaScript av finns texten, tabellerna och kryssrutorna kvar. */

(function () {
  "use strict";

  /* Varje del körs i sin egen kapsel. Går en del sönder – på en gammal webbläsare,
     eller för att en sida saknar det den behöver – fortsätter de övriga att fungera. */
  function kor(fn) {
    try { fn(); } catch (e) { /* Den delen uteblir. Sidan går fortfarande att läsa. */ }
  }

  /* localStorage fungerar inte överallt (privat läge, vissa filsökvägar).
     Därför går all lagring genom de här två funktionerna som aldrig kastar fel. */

  var NYCKEL = "elevpaket:" + (document.body.dataset.nyckel || location.pathname);

  function las() {
    try { return JSON.parse(localStorage.getItem(NYCKEL) || "{}"); }
    catch (e) { return {}; }
  }

  function skriv(data) {
    try { localStorage.setItem(NYCKEL, JSON.stringify(data)); }
    catch (e) { /* Sparas inte. Sidan fungerar ändå. */ }
  }

  /* ---------------- Kravlistor: kryss, förlopp och sparning ---------------- */

  kor(function () {
    var sparat = las();

    Array.prototype.forEach.call(document.querySelectorAll(".kravblock"), function (block) {
      var rutor = Array.prototype.slice.call(block.querySelectorAll("input[type=checkbox]"));
      var stapel = block.querySelector(".stapel span");
      var antal = block.querySelector(".antal");
      if (!rutor.length) { return; }

      function uppdatera() {
        var klara = rutor.filter(function (r) { return r.checked; }).length;
        if (stapel) { stapel.style.width = (klara / rutor.length * 100) + "%"; }
        if (antal) { antal.textContent = klara + " av " + rutor.length; }
      }

      rutor.forEach(function (ruta) {
        if (sparat[ruta.id]) { ruta.checked = true; }
        ruta.addEventListener("change", function () {
          sparat[ruta.id] = ruta.checked;
          skriv(sparat);
          uppdatera();
        });
      });

      uppdatera();
    });

    var nollstall = document.getElementById("nollstall");
    if (nollstall) {
      nollstall.addEventListener("click", function () {
        Array.prototype.forEach.call(
          document.querySelectorAll(".kravblock input[type=checkbox]"),
          function (r) {
            r.checked = false;
            r.dispatchEvent(new Event("change"));
          }
        );
      });
    }
  });

  /* ---------------- Innehållsförteckning: markera var man är ---------------- */

  kor(function () {
    var lankar = Array.prototype.slice.call(document.querySelectorAll(".innehall a[href^='#']"));
    if (!lankar.length || !("IntersectionObserver" in window)) { return; }

    var karta = {};
    lankar.forEach(function (a) {
      var mal = document.getElementById(a.getAttribute("href").slice(1));
      if (mal) { karta[mal.id] = a; }
    });

    var synliga = [];

    /* rootMargin tar bara px och procent – aldrig rem. Toppmarginalen motsvarar
       den fastnaglade toppraden, bottenmarginalen struntar i nedre halvan av rutan. */
    var vakt = new IntersectionObserver(function (poster) {
      poster.forEach(function (post) {
        var i = synliga.indexOf(post.target.id);
        if (post.isIntersecting && i === -1) { synliga.push(post.target.id); }
        if (!post.isIntersecting && i !== -1) { synliga.splice(i, 1); }
      });

      lankar.forEach(function (a) { a.classList.remove("har"); });

      if (synliga.length) {
        /* Den översta av de synliga rubrikerna är den man läser. */
        var overst = synliga.slice().sort(function (a, b) {
          return document.getElementById(a).offsetTop - document.getElementById(b).offsetTop;
        })[0];
        if (karta[overst]) { karta[overst].classList.add("har"); }
      }
    }, { rootMargin: "-72px 0px -60% 0px" });

    Object.keys(karta).forEach(function (id) { vakt.observe(document.getElementById(id)); });
  });

  /* ---------------- Sök i en tabell ---------------- */

  kor(function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-sok]"), function (falt) {
      var tabell = document.getElementById(falt.dataset.sok);
      if (!tabell) { return; }
      var rader = Array.prototype.slice.call(tabell.querySelectorAll("tbody tr"));
      var traffar = document.getElementById(falt.dataset.traffar);

      falt.addEventListener("input", function () {
        var q = falt.value.trim().toLowerCase();
        var n = 0;
        rader.forEach(function (rad) {
          var med = !q || rad.textContent.toLowerCase().indexOf(q) !== -1;
          rad.hidden = !med;
          if (med) { n++; }
        });
        if (traffar) {
          traffar.textContent = q
            ? n + (n === 1 ? " rad matchar" : " rader matchar")
            : rader.length + " rader";
        }
      });
    });
  });

  /* ---------------- Ordträning ---------------- */

  kor(function () {
    var traning = document.getElementById("traning");
    if (!traning) { return; }

    var kalltabell = document.getElementById(traning.dataset.kalla);
    var ordUt = traning.querySelector(".ordet");
    var svarUt = traning.querySelector(".svaret");
    var restUt = traning.querySelector(".rest");
    var visaKnapp = document.getElementById("visa-svar");
    var nastaKnapp = document.getElementById("nasta-ord");

    var ord = kalltabell
      ? Array.prototype.map.call(kalltabell.querySelectorAll("tbody tr"), function (rad) {
          return {
            ord: rad.cells[0].textContent.trim(),
            svar: rad.cells[1].textContent.trim()
          };
        })
      : [];

    if (!ord.length) { traning.hidden = true; return; }

    var kvar = [];

    /* Blandar en kopia av listan. Fisher–Yates: gå bakifrån och byt plats med en
       slumpad tidigare position. Varje ordning blir lika sannolik. */
    function blanda() {
      kvar = ord.slice();
      for (var i = kvar.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = kvar[i]; kvar[i] = kvar[j]; kvar[j] = t;
      }
    }

    function nasta() {
      if (!kvar.length) { blanda(); }
      var post = kvar.pop();
      ordUt.textContent = post.ord;
      svarUt.textContent = post.svar;
      svarUt.hidden = true;
      restUt.textContent = (ord.length - kvar.length) + " / " + ord.length;
      visaKnapp.disabled = false;
    }

    visaKnapp.addEventListener("click", function () {
      svarUt.hidden = false;
      visaKnapp.disabled = true;
    });
    nastaKnapp.addEventListener("click", nasta);

    blanda();
    nasta();
  });

  /* ---------------- Nedräkning till deadlines ---------------- */

  kor(function () {
    var poster = document.querySelectorAll("ul.datum li[data-datum]");
    if (!poster.length) { return; }

    var idag = new Date();
    idag.setHours(0, 0, 0, 0);
    var nastaHittad = false;

    Array.prototype.forEach.call(poster, function (li) {
      var ut = li.querySelector(".kvar");
      if (!ut) { return; }

      var d = new Date(li.dataset.datum + "T23:59:00");
      var dagar = Math.ceil((d - idag) / 86400000) - 1;

      if (dagar < 0) {
        li.classList.add("forbi");
        ut.textContent = "passerat";
      } else if (dagar === 0) {
        ut.textContent = "idag 23:59";
        if (!nastaHittad) { li.classList.add("nast"); nastaHittad = true; }
      } else {
        ut.textContent = "om " + dagar + (dagar === 1 ? " dag" : " dagar");
        if (!nastaHittad) { li.classList.add("nast"); nastaHittad = true; }
      }
    });
  });
})();
