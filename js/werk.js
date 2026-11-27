/* Werkseite (werk.html?id=…): ein Werk mit allen Angaben.
 *
 * Gleiches Muster wie die Galerie: `zustand` mit lage (laedt, inhalt,
 * leer, fehler), aendere() und zeichne(). Der Museumstext ist HTML und wird
 * vor dem Einsetzen mit DOMPurify bereinigt (Entscheidung in der README, A4). */

import DOMPurify from "dompurify";
import { bildUrl, ladeWerk } from "./api.js";
import { istFavorit, schalteFavorit } from "./favoriten.js";

const status = document.querySelector("#status");
const erneut = document.querySelector("#erneut");
const angaben = document.querySelector("#werk");
const favorit = document.querySelector("#favorit");

const zustand = {
  lage: "laedt",
  werk: null,
  meldung: "",
};

function aendere(aenderung) {
  Object.assign(zustand, aenderung);
  zeichne();
}

/** Text in ein Element schreiben; fehlt er, steht dort ein Strich. */
function setze(selektor, text) {
  document.querySelector(selektor).textContent = text || "–";
}

function zeichne() {
  const { lage, werk, meldung } = zustand;
  status.textContent = { laedt: "Lade Werk …", inhalt: "", leer: meldung, fehler: meldung }[lage];
  erneut.hidden = lage !== "fehler";
  angaben.hidden = lage !== "inhalt";
  if (lage !== "inhalt") return;

  document.title = `${werk.title} – Artwell`;
  setze("#werk-titel", werk.title);
  setze("#werk-kuenstler", werk.artist || "Unbekannt");
  setze("#werk-datum", werk.date);
  setze("#werk-art", werk.artworkType);
  setze("#werk-technik", werk.medium);
  setze("#werk-masse", werk.dimensions);
  setze("#werk-sammlung", werk.creditLine);

  // Der Bildserver vergrößert nicht: höchstens so breit wie das Original.
  const bild = document.querySelector("#werk-bild");
  bild.src = bildUrl(werk.imageId, Math.min(843, werk.width));
  bild.alt = werk.altText;
  bild.width = werk.width;
  bild.height = werk.height;
  document.querySelector("#werk-gross").href = bildUrl(werk.imageId, Math.min(1686, werk.width));

  const text = document.querySelector("#werk-text");
  if (werk.description) text.innerHTML = DOMPurify.sanitize(werk.description);
  else text.textContent = "Für dieses Werk hat das Museum keinen Text veröffentlicht.";

  document.querySelector("#werk-quelle").href = `https://www.artic.edu/artworks/${werk.id}`;

  const gemerkt = istFavorit(werk.id);
  favorit.setAttribute("aria-pressed", gemerkt);
  favorit.textContent = gemerkt ? "Gemerkt" : "Favorit";
}

async function lade(id) {
  aendere({ lage: "laedt" });
  try {
    const werk = await ladeWerk(id);
    if (werk) aendere({ lage: "inhalt", werk });
    else aendere({ lage: "leer", meldung: "Dieses Werk zeigt Artwell nicht: Es ist nicht gemeinfrei oder hat keine Abbildung." });
  } catch (fehler) {
    aendere({ lage: "fehler", meldung: fehler.message });
  }
}

export function starteWerk() {
  if (!angaben) return; // nicht auf werk.html
  const id = Number(new URLSearchParams(location.search).get("id"));
  if (!Number.isInteger(id) || id < 1) {
    aendere({ lage: "leer", meldung: "Kein Werk angegeben. Werke finden sich in der Ausstellung der Woche oder über die Suche." });
    return;
  }
  erneut.onclick = () => lade(id);
  favorit.onclick = () => {
    schalteFavorit(zustand.werk);
    zeichne();
  };
  lade(id);
}
