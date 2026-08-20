# Elevpaket – prod

Det här är prod-repot. Det som ligger här är live på
**https://andrenlindhe.github.io/** inom en minut efter en push.

## Den enda regeln som inte får brytas

Kursmapparna är **genererade**. De är kopior av dev-nodernas elevpaket.

- Redigera **aldrig** något inuti `granssnitt-webb/` eller någon annan kursmapp för hand.
  Ändringen försvinner vid nästa publicering och finns då i ingen historik.
- Ska innehållet ändras: ändra i dev-noden, committa där, kör `publicera.py`.
- Samma regel som `dist/` i dev-noderna. Kopior är ofarliga precis så länge ingen rör dem.

## Vad som ägs var

| Ligger här | Vad |
|---|---|
| `index.html` | Landningssidan. Ett kort per kurs. Ägs av prod |
| `stil.css`, `paket.js` | Skalet. **Källan** finns här och kopieras ner till dev-noderna |
| `<kurs>/` | Genererat. Kopia av dev-nodens `elevpaket/`, inklusive sin egen kopia av skalet |
| `noder.json` | Vilka dev-noder som publiceras hit, och till vilken mapp |
| `publicerat.json` | Vilken dev-commit varje kursmapp kommer från, och när |
| `publicera.py` | Verktyget |

Kursmappen har en egen kopia av `stil.css` och `paket.js`. Det ser ut som dubblering men
är genererat från källan i roten, och det är priset för att sökvägarna inuti paketet ska se
likadana ut i dev som i prod. Ingen fil behöver skrivas om vid publicering.

## Publicera

```bash
python publicera.py --torrkor        # visa vad som skulle hända
python publicera.py granssnitt-webb  # en kurs
python publicera.py                  # alla
git add -A && git commit -m "..." && git push
```

Skriptet gör, i ordning:

1. Vägrar om **källmappen** i dev har ocommittade ändringar. Det som är live ska gå att
   spåra till en commit. `--tvinga` går förbi, och ska användas nästan aldrig.
2. Kopierar ner `stil.css` och `paket.js` till dev, så att förhandsgranskningen där inte
   ljuger om hur det ser ut live.
3. Speglar dev-paketet hit, inklusive att ta bort filer som försvunnit i dev. Utan det
   ligger gamla sidor kvar och går att googla fram.
4. Kör `kontrollera_paket.py` mot **hela** prod-trädet. Landningssidans länkar in i
   kursmapparna finns bara här, och det är precis de som går sönder.
5. Stannar vid fel. Halvpublicerat är värre än opublicerat.
6. Skriver `publicerat.json`.

Sedan tittar du på `git status`, ser exakt vad som ändras, och pushar. En push, allt live.

## Lägga till en kurs

1. Lägg till noden i `noder.json` med `kalla` = sökvägen till dev-nodens `elevpaket/`.
2. Lägg till ett kort på landningssidan som länkar till `<mapp>/index.html`.
3. Kursens egen `index.html` ska ha `<a href="../index.html">← Alla kurser</a>` i toppen.
4. Kör `publicera.py <mapp>`.

## Vad som aldrig får hamna här

Dev-noderna innehåller lärarversionen av planeringen, bedömningsresonemang och
presentationernas talarstöd. Det publiceras inte, och det är därför uppdelningen finns.
Publicera bara från `elevpaket/`-mappar, aldrig från `material/` eller `dist/`.
