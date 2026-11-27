/* Galerie: zeigt Werke als Raster und kennt vier Zustände.
 *
 *   laedt  – „Lade Werke …“
 *   inhalt – die Werke, dazu „Werke 1 bis 24 von 96“ und Blättern
 *   leer   – ein Hinweistext statt einer leeren Fläche
 *   fehler – eine verständliche Meldung und „Erneut versuchen“
 *
 * Wie bei den Themenvorschlägen steht alles, was die Anzeige bestimmt, in
 * `zustand`; aendere() ändert ihn, zeichne() baut die Anzeige daraus neu.
 * Woher die Werke kommen, entscheidet die Seite: Sie übergibt eine Funktion
 * ladeSeite(seite, proSeite), die { werke, gesamt } liefert. */

import { bildUrl, MAX_TREFFER } from "./api.js";

const PRO_SEITE = 24;

const status = document.querySelector("#status");
const ergebnisse = document.querySelector("#ergebnisse");
const erneut = document.querySelector("#erneut");
const blaettern = document.querySelector("#blaettern");

const zustand = {
  lage: "laedt",
  werke: [],
  gesamt: 0,
  seite: 1,
  meldung: "",
};

let laufNummer = 0;

function aendere(aenderung) {
  Object.assign(zustand, aenderung);
  zeichne();
}

function zeichne() {
  const { lage, werke, gesamt, seite, meldung } = zustand;
  const von = (seite - 1) * PRO_SEITE + 1;

  if (lage === "laedt") status.textContent = "Lade Werke …";
  if (lage === "inhalt") status.textContent = `Werke ${von} bis ${von + werke.length - 1} von ${gesamt}`;
  if (lage === "leer" || lage === "fehler") status.textContent = meldung;

  ergebnisse.replaceChildren(...(lage === "inhalt" ? werke.map(baueKachel) : []));
  ergebnisse.setAttribute("aria-busy", lage === "laedt");
  erneut.hidden = lage !== "fehler";
  zeichneBlaettern();
}

/** Ein Werk mit Tafel wie im Museum: Künstler, Titel kursiv, Jahr. */
function baueKachel(werk) {
  const bild = document.createElement("img");
  bild.src = bildUrl(werk.imageId);
  bild.alt = werk.altText;
  bild.width = werk.width; // feste Maße: das Layout springt nicht, wenn das Bild ankommt
  bild.height = werk.height;
  bild.loading = "lazy";

  const titel = document.createElement("cite");
  titel.lang = "en";
  titel.textContent = werk.title;
  const tafel = document.createElement("p");
  tafel.className = "plaque";
  tafel.append(werk.artist || "Unbekannt", titel, werk.date);

  const eintrag = document.createElement("li");
  eintrag.append(bild, tafel);
  return eintrag;
}

/** „Zurück“ und „Weiter“ sind normale Links mit ?seite=…, so funktioniert auch der Zurück-Button. */
function zeichneBlaettern() {
  const seiten = Math.min(Math.ceil(zustand.gesamt / PRO_SEITE), Math.floor(MAX_TREFFER / PRO_SEITE));
  blaettern.replaceChildren();
  if (zustand.lage !== "inhalt" || seiten < 2) return;

  const { seite } = zustand;
  const position = document.createElement("span");
  position.textContent = `Seite ${seite} von ${seiten}`;
  if (seite > 1) blaettern.append(seitenLink(seite - 1, "Zurück"));
  blaettern.append(position);
  if (seite < seiten) blaettern.append(seitenLink(seite + 1, "Weiter"));
}

function seitenLink(nummer, text) {
  const url = new URL(location.href);
  url.searchParams.set("seite", nummer);
  const link = document.createElement("a");
  link.className = "button button--leise";
  link.href = url.search;
  link.textContent = text;
  return link;
}

/** Startet die Galerie. leerText erscheint, wenn es keine Werke gibt. */
export async function starteGalerie(ladeSeite, leerText) {
  const seite = Math.max(1, Math.floor(Number(new URLSearchParams(location.search).get("seite"))) || 1);
  erneut.onclick = () => starteGalerie(ladeSeite, leerText);

  // Kommt eine ältere Antwort erst nach einer neueren an, wird sie verworfen.
  const meinLauf = ++laufNummer;

  aendere({ lage: "laedt", seite });
  try {
    const { werke, gesamt } = await ladeSeite(seite, PRO_SEITE);
    if (meinLauf !== laufNummer) return;
    if (werke.length === 0) aendere({ lage: "leer", meldung: leerText });
    else aendere({ lage: "inhalt", werke, gesamt });
  } catch (fehler) {
    if (meinLauf !== laufNummer) return;
    aendere({ lage: "fehler", meldung: fehler.message });
  }
}
