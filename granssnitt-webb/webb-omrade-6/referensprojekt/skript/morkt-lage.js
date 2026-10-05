// Mörkt läge. Knappen växlar mellan ljust och mörkt och minns valet till nästa besök.
// Utan JavaScript följer sajten systemets inställning, med CSS. Knappen har hidden i
// HTML:en och visas först här, eftersom den inte gör något utan skriptet.

const knapp = document.querySelector(".lage-knapp");
const rot = document.documentElement;

// Är sidan mörk just nu? Ett eget val går före systemets inställning.
function arMork() {
  if (rot.classList.contains("morkt")) {
    return true;
  }
  if (rot.classList.contains("ljust")) {
    return false;
  }
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

// Sätter läget och sparar valet. localStorage kan vara avstängt och kastar då ett
// fel. try gör att sidan fungerar ändå, fast utan minne.
function sattLage(lage) {
  rot.classList.remove("morkt", "ljust");
  rot.classList.add(lage);
  knapp.setAttribute("aria-pressed", lage === "morkt");
  try {
    localStorage.setItem("lage", lage);
  } catch (fel) {
    // Inget minne. Läget gäller tills sidan laddas om.
  }
}

// Ett sparat val från förra besöket
try {
  const sparat = localStorage.getItem("lage");
  if (sparat) {
    sattLage(sparat);
  }
} catch (fel) {
  // Inget sparat val. Systemets inställning gäller.
}

knapp.hidden = false;
knapp.setAttribute("aria-pressed", arMork());

knapp.addEventListener("click", function () {
  if (arMork()) {
    sattLage("ljust");
  } else {
    sattLage("morkt");
  }
});
