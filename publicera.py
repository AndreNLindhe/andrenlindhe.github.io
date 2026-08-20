#!/usr/bin/env python3
"""Publicerar ett elevpaket från en dev-nod hit, till prod-repot.

Innehållet går uppåt: dev-nodens elevpaket speglas till sin mapp här.
Skalet går nedåt: stil.css och paket.js ägs av prod och kopieras ner till dev,
så att det du förhandsgranskar är byte för byte det som blir live.

    python publicera.py                 alla noder i noder.json
    python publicera.py granssnitt-webb en enda nod
    python publicera.py --torrkor       visa vad som skulle hända, rör ingenting

Skriptet stannar vid första felet. Halvpublicerat är värre än opublicerat.
"""

import argparse
import datetime
import filecmp
import json
import pathlib
import shutil
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):  # äldre Python, eller omdirigerad ström
    pass

PROD = pathlib.Path(__file__).resolve().parent
NODER = PROD / "noder.json"
MANIFEST = PROD / "publicerat.json"
SKALET = ("stil.css", "paket.js")
KONTROLL = pathlib.Path.home() / ".claude" / "skills" / "nasta-lektion" / "skript" / "kontrollera_paket.py"

# Filer som aldrig följer med upp, oavsett vad som ligger i dev-mappen.
HOPPA_OVER = {".git", ".gitignore", ".gitattributes", "__pycache__", "Thumbs.db", ".DS_Store"}
HOPPA_SUFFIX = {".psd", ".ai", ".zip", ".mp4", ".mov", ".pyc"}


class Fel(Exception):
    """Något som gör att publiceringen inte får fortsätta."""


def las_noder():
    if not NODER.exists():
        raise Fel(f"hittar inte {NODER.name}. Den listar vilka dev-noder som publiceras hit.")
    with NODER.open(encoding="utf-8") as f:
        return json.load(f)


def ska_hoppas_over(sokvag):
    return sokvag.name in HOPPA_OVER or sokvag.suffix.lower() in HOPPA_SUFFIX


def git(kalla, *argument):
    """Kör git i dev-noden. encoding sätts explicit: git svarar i UTF-8, och utan
    detta avkodar Windows svaret med cp1252 så att å ä ö i sökvägen blir obrukbara."""
    return subprocess.run(["git", "-C", str(kalla), *argument], capture_output=True,
                          text=True, encoding="utf-8", errors="replace", check=True).stdout.strip()


def dev_commit(kalla):
    """Returnerar (commit, smutsig) för dev-noden, eller (None, None) om den inte är ett repo.

    Smutsig gäller bara källmappen, inte hela repot. En halvskriven genomgång i
    material/ ska inte hindra dig från att publicera en rättad uppgiftssida."""
    try:
        # Den senaste committen som rörde själva källmappen, inte dev-nodens HEAD.
        # Då säger manifestet något om innehållet som ligger live, inte om när
        # någon råkade skriva om en genomgång i en annan mapp.
        commit = git(kalla, "log", "-1", "--format=%h", "--", str(kalla))
        status = git(kalla, "status", "--porcelain", "--", str(kalla))
        return commit, bool(status)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None, None


def kopiera_ner_skalet(kalla, torrkor):
    """Prod äger stil.css och paket.js. Dev ska ha samma, annars ljuger förhandsgranskningen."""
    andrade = []
    for namn in SKALET:
        upp, ner = PROD / namn, kalla / namn
        if not upp.exists():
            raise Fel(f"{namn} saknas i prod-roten. Skalet ägs härifrån.")
        if not ner.exists() or not filecmp.cmp(upp, ner, shallow=False):
            andrade.append(namn)
            if not torrkor:
                shutil.copy2(upp, ner)
    return andrade


def spegla(kalla, mal, torrkor):
    """Kopierar dev-paketet till prod-mappen och tar bort det som försvunnit i dev.

    Utan borttagningen ligger gamla sidor kvar och ruttnar: de går inte att nå
    från någon länk, men de går att googla fram."""
    nya, uppdaterade, borttagna = [], [], []

    kallfiler = {f.relative_to(kalla) for f in kalla.rglob("*")
                 if f.is_file() and not any(ska_hoppas_over(d) for d in (f, *f.parents))}
    malfiler = {f.relative_to(mal) for f in mal.rglob("*")
                if f.is_file() and not any(ska_hoppas_over(d) for d in (f, *f.parents))} if mal.exists() else set()

    for rel in sorted(kallfiler):
        kall, m = kalla / rel, mal / rel
        if not m.exists():
            nya.append(rel)
        elif not filecmp.cmp(kall, m, shallow=False):
            uppdaterade.append(rel)
        else:
            continue
        if not torrkor:
            m.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(kall, m)

    for rel in sorted(malfiler - kallfiler):
        borttagna.append(rel)
        if not torrkor:
            (mal / rel).unlink()

    if not torrkor:
        for katalog in sorted(mal.rglob("*"), reverse=True):
            if katalog.is_dir() and not any(katalog.iterdir()):
                katalog.rmdir()

    return nya, uppdaterade, borttagna


def kontrollera():
    """Körs mot hela prod-trädet. Landningssidans länkar in i kursmapparna finns bara här."""
    if not KONTROLL.exists():
        raise Fel(f"hittar inte kontrollskriptet: {KONTROLL}")
    klar = subprocess.run([sys.executable, str(KONTROLL), str(PROD)],
                          capture_output=True, text=True, encoding="utf-8", errors="replace")
    print(klar.stdout.strip())
    if klar.stderr.strip():
        print(klar.stderr.strip())
    if klar.returncode != 0:
        raise Fel("kontrollen gick inte igenom. Inget är pushat — rätta i dev-noden och kör om.")


def skriv_manifest(publicerat):
    tidigare = {}
    if MANIFEST.exists():
        with MANIFEST.open(encoding="utf-8") as f:
            tidigare = json.load(f)
    tidigare.update(publicerat)
    with MANIFEST.open("w", encoding="utf-8") as f:
        json.dump(tidigare, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")


def main():
    p = argparse.ArgumentParser(description="Publicerar elevpaket från dev-noder till prod.")
    p.add_argument("mapp", nargs="?", help="en enskild nod ur noder.json. Utelämnas: alla.")
    p.add_argument("--torrkor", action="store_true", help="visa vad som skulle hända, ändra ingenting")
    p.add_argument("--tvinga", action="store_true", help="publicera trots ocommittade ändringar i dev")
    args = p.parse_args()

    noder = las_noder()
    if args.mapp:
        if args.mapp not in noder:
            raise Fel(f"noden {args.mapp} finns inte i noder.json. Kända: {', '.join(sorted(noder))}")
        noder = {args.mapp: noder[args.mapp]}

    publicerat = {}
    for mapp, nod in sorted(noder.items()):
        kalla = pathlib.Path(nod["kalla"])
        if not kalla.is_dir():
            raise Fel(f"källan för {mapp} finns inte: {kalla}")

        commit, smutsig = dev_commit(kalla)
        if commit is None:
            raise Fel(f"{kalla} ligger inte i ett git-repo. Det som är live ska gå att spåra "
                      f"till en commit — kör git init i dev-noden först.")
        if smutsig and not args.tvinga:
            raise Fel(f"dev-noden för {mapp} har ocommittade ändringar. Committa dem först, "
                      f"annars går det inte att säga vad som ligger live. (--tvinga går förbi.)")

        print(f"\n{mapp}  ←  {kalla}")
        print(f"  dev-commit {commit}{' (ocommittat, tvingat)' if smutsig else ''}")

        for namn in kopiera_ner_skalet(kalla, args.torrkor):
            print(f"  skal ner   {namn}")

        mal = PROD / mapp
        nya, uppdaterade, borttagna = spegla(kalla, mal, args.torrkor)
        for rel in nya:
            print(f"  ny         {rel.as_posix()}")
        for rel in uppdaterade:
            print(f"  uppdaterad {rel.as_posix()}")
        for rel in borttagna:
            print(f"  borttagen  {rel.as_posix()}")
        if not (nya or uppdaterade or borttagna):
            print("  oförändrad")

        publicerat[mapp] = {
            "namn": nod.get("namn", mapp),
            "kalla": str(kalla),
            "commit": commit,
            "publicerad": datetime.date.today().isoformat(),
        }

    if args.torrkor:
        print("\nTorrkörning. Ingenting ändrades.")
        return

    print()
    kontrollera()
    skriv_manifest(publicerat)

    print("\nKlart. Granska och publicera:")
    print("  git -C . status")
    print("  git add -A && git commit -m \"...\" && git push")


if __name__ == "__main__":
    try:
        main()
    except Fel as e:
        print(f"\nSTOPP: {e}", file=sys.stderr)
        sys.exit(1)
