// Ljudmodulen. Spelar ett ljud när något händer med ett element som har
// attributet data-ljud. Värdet är filnamnet utan .mp3:
//   <button data-ljud="vaxla">
// Utan något annat är det ett klick. data-ljud-nar väljer en annan händelse:
//   <input data-ljud="klart" data-ljud-nar="change">
// Ändra inställningarna nedan. Resten behöver du inte röra.

// Inställningar
const LJUDMAPP = "ljud/";  // var ljudfilerna ligger, räknat från sidan
const VOLYM = 0.5;         // 0 är tyst, 1 är fullt

// Spelar filen som heter namn. Gör ingenting om ljudet är avstängt.
function spela(namn) {
  if (document.documentElement.classList.contains("ljud-av")) {
    return;
  }
  const ljud = new Audio(LJUDMAPP + namn + ".mp3");
  ljud.volume = VOLYM;
  ljud.play();
}

// Hitta alla element med data-ljud och lyssna efter händelsen på vart och ett.
const ljudelement = document.querySelectorAll("[data-ljud]");

for (const element of ljudelement) {
  let handelse = "click";
  if (element.dataset.ljudNar) {
    handelse = element.dataset.ljudNar;
  }
  element.addEventListener(handelse, function () {
    spela(element.dataset.ljud);
  });
}
