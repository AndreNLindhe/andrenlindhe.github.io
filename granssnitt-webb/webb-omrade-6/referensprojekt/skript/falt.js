// Ett obligatoriskt fält visar att det är rätt ifyllt när man lämnar det.
// Hur det ser ut står i stil.css under .godkant. Här byts bara klassen.
const obligatoriska = document.querySelectorAll("input[required]");

for (const falt of obligatoriska) {
  falt.addEventListener("change", function () {
    if (falt.checkValidity()) {
      falt.classList.add("godkant");
    } else {
      falt.classList.remove("godkant");
    }
  });
}
