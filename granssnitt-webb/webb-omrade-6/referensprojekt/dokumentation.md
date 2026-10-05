# Dokumentation – Fyrar längs Bohuskusten

Referensprojektets dokumentation i projekt 4:s och projekt 5:s form. Avsnitten Åtgärder och
Testprotokoll visades i område 5. Avsnittet Skript, överlämningen och avvikelserna visas i
pass 50 som exempel på hur din egen `dokumentation.md` ska se ut i projekt 5.

*Versionsnumren står som NN. Fyll i skoldatorernas riktiga nummer och kör om testen innan
protokollet visas – det är ett protokoll, inte en affisch.*

## Åtgärder

Två källor: åtgärdslistan från en klasskamrats heuristiska granskning i december, och
WCAG-fynden från den egna granskningen i Gränssnittsdesign den 18 januari. Numren följer
ordningen de fördes in i, inte prioriteringen. Varje åtgärd har ett eget commit som börjar
med *Åtgärd N*.

| Nr | Källa | Vad du gjorde | Var | Status |
|---|---|---|---|---|
| 1 | Åtgärdslistan, prioritet 1 | Navigeringen tog fyra rader i sidled på telefon och sköt ned innehållet. Staplad som grundstil, en rad från 28em | `stil.css`, `nav ul` | Åtgärdad |
| 2 | Åtgärdslistan, prioritet 1 | Länkarna i navigeringen låg så tätt att fel länk träffades. `min-height: 2.75rem` | `stil.css`, `nav a` | Åtgärdad |
| 3 | Åtgärdslistan, prioritet 3 | Faktarutan hamnar långt ned på telefon. Inte ändrad: den står efter artikeln i HTML:en med avsikt, och ordningen är den som skärmläsaren och tangentbordet följer | `vinga.html` | Inte, med skäl |
| 4 | WCAG 1.2.2, nivå A | Sajten har ingen video. Ljudet `vaxla.mp3` från område 6 är ett gränssnittsljud, inte innehåll med tal, och har en synlig motsvarighet | – | Inte tillämpligt |
| 5 | WCAG 1.4.11, nivå AA | Fältkanterna hade 1,4:1 mot vitt. Ny variabel `--linje-falt`, 3,7:1 | `stil.css`, `:root` och `input, select, textarea` | Åtgärdad |
| 6 | WCAG 2.4.1, nivå A | Uppfyllt redan av landmärkena `header`, `nav` och `main`. Skip-länk tillagd ändå, för den som tabbar | alla sidor, `stil.css` `.till-innehallet` | Åtgärdad |

## Testprotokoll

Varje rad är ett test som går att göra om. Ett fel följs av en ny rad med omtestet.

| Test | Med vad | Sida | Resultat | Åtgärd |
|---|---|---|---|---|
| Validering HTML | W3C Nu HTML Checker | alla sidor | Inga fel | Ingen |
| Validering CSS | W3C CSS-validatorn | `stil.css` | Inga fel | Ingen |
| Bredder | Chrome NN, device mode 320–1600 px | alla sidor | Ingen sidledsrullning. Tabellen på `fyrarna.html` rullar i sitt eget svep | Ingen |
| Andra webbläsaren | Firefox NN, 320–1600 px | alla sidor | Som i Chrome | Ingen |
| Telefon | Pixel 7, Chrome NN | `vinga.html` | Länkarna i navigeringen ligger så tätt att tummen träffar fel | `min-height` på `nav a`, `stil.css` (åtgärd 2) |
| Telefon, omtest | Pixel 7, Chrome NN | `vinga.html` | Rätt länk träffas varje gång | Ingen |
| Tangentbord | Firefox NN | `rapportera.html` | Skip-länken syns på första Tab. Alla fält och knappen nås i läsordning, fokus syns hela vägen, och Tab tar sig ut ur formuläret | Ingen |
| Sidvikt | Chrome NN, nätverksfliken, 360 px | `index.html` | Fotot hämtas som `vinga-smal.jpg`, 14 kB, i stället för `vinga-1200.jpg`, 46 kB | Ingen |
| Lighthouse | Chrome NN, kategorin Tillgänglighet | `index.html` | Inga anmärkningar. Alt-textens innehåll är kontrollerat för hand – verktyget ser bara att den finns | Ingen |
| Utan JavaScript | Chrome NN, DevTools: *Disable JavaScript* | alla sidor | Allt innehåll, alla länkar och formuläret fungerar. Lägesknappen syns inte. Mörkt läge följer systemet. Fältet får ingen markering, men webbläsaren stoppar ett tomt obligatoriskt fält | Ingen |
| Utan JavaScript, andra webbläsaren | Firefox NN, `about:config`, `javascript.enabled` av | alla sidor | Som i Chrome | Ingen |
| Med JavaScript | Chrome NN och Firefox NN | alla sidor | Lägesknappen byter läge, spelar `vaxla.mp3` och minns valet efter omladdning. Inga fel i konsolen | Ingen |
| Reducerad rörelse | Chrome NN, Rendering-panelen, *prefers-reduced-motion: reduce* | `rapportera.html` | Fältets markering kommer direkt, utan övergång | Ingen |

## Skript

En rad per fil. Alla ligger i `skript/` och kopplas med `defer` i `<head>`.

| Fil | Vad den gör | Var | Ändrat i modulen |
|---|---|---|---|
| `ljud.js` | Ljudmodulen. Spelar `ljud/<namn>.mp3` vid klick, eller vid händelsen i `data-ljud-nar`, på element med `data-ljud`. Tyst om `html` har klassen `ljud-av` | alla sidor | Inget. Styrs från HTML:en: `data-ljud="vaxla"` på lägesknappen |
| `morkt-lage.js` | Visar lägesknappen, växlar klassen `morkt` eller `ljust` på `html` och sparar valet i `localStorage` | alla sidor | Inget |
| `falt.js` | Ger obligatoriska fält klassen `godkant` när de lämnas rätt ifyllda | `rapportera.html` | Egen händelsekod, ingen modul |

Skripten ändrar bara klasser och attribut. Allt som syns står i `stil.css`: den mörka
paletten i avsnitt 1, lägesknappen i avsnitt 5 och `input.godkant` i avsnitt 10.

## Överlämningen

*I ditt projekt ligger överlämningstabellen på portföljsidan `07 Ljud och rörelse` i
Gränssnittsdesign, och den skrivs inte av hit. Referensprojektet har ingen portfölj, och
därför står dess tabell här, som exempel på formen.*

| fil | händelse | längd | synlig motsvarighet |
|---|---|---|---|
| `vaxla.mp3` | klick på lägesknappen | 120 ms | färgerna byts, knappen ser nedtryckt ut |

| element | utlösare | vad som ändras | varaktighet | tidskurva | utan rörelse |
|---|---|---|---|---|---|
| obligatoriskt fält i `rapportera.html` | lämnar fältet rätt ifyllt | kantens färg, stapel till vänster | 150 ms | `ease-out` | ändringen sker direkt |

## Avvikelser från överlämningen

Varje ställe där koden inte gör som tabellen säger, med tabellens rad och ett skäl.

| Rad | Avvikelse | Skäl |
|---|---|---|
| Rörelse, fältet | Markeringen försvinner utan övergång när fältet töms igen | Tabellen beskriver bara vägen in. Övergången sitter på `input.godkant`, och när klassen tas bort finns ingen övergång kvar. Frågan är ställd till designern: ska vägen ut också ta 150 ms? |
