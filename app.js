// Einstieg für alle Seiten. Vite bündelt diese Datei mit den Modulen aus js/.
// Ohne JavaScript bleibt jede Seite lesbar: Dann steht dort der Text aus dem HTML.

import { themen } from "./js/themen.js";
import { heuteInBerlin, isoDatum, montagDerWoche, plusWochen, sonntagDerWoche, themaIndex, zeitraum } from "./js/woche.js";

const jahr = document.querySelector("#jahr");
if (jahr) jahr.textContent = new Date().getFullYear();

// --- Ausstellung der Woche -------------------------------------------

const heute = heuteInBerlin();
const montag = montagDerWoche(heute);
const aktuellIndex = themaIndex(heute, themen.length);
const aktuell = themen[aktuellIndex];

// Texte mit data-aktuell="…" bekommen das Thema dieser Woche.
for (const element of document.querySelectorAll("[data-aktuell]")) {
  const feld = element.dataset.aktuell;
  if (feld === "titel") element.textContent = aktuell.titel;
  if (feld === "einfuehrung") element.textContent = aktuell.einfuehrung;
  if (feld === "zeitraum") {
    element.textContent = `Vom ${zeitraum(montag)}`;
    element.hidden = false;
  }
  if (feld === "link") {
    element.textContent = aktuell.titel;
    element.href = `#${aktuell.slug}`;
  }
}

// Auf der Übersicht wandert das Schild „Diese Woche“ zur richtigen Karte.
const schild = document.querySelector(".theme-list .badge");
const karte = document.getElementById(aktuell.slug);
if (schild && karte) karte.prepend(schild);

// Jede Themenkarte nennt ihren nächsten Termin, z. B. „In 3 Wochen: vom 23. bis 29. November 2026“.
themen.forEach((thema, index) => {
  const themenKarte = document.getElementById(thema.slug);
  const ueberschrift = themenKarte?.querySelector("h3");
  if (!ueberschrift) return;

  const inWochen = (index - aktuellIndex + themen.length) % themen.length;
  const wann = zeitraum(plusWochen(montag, inWochen));
  let text = `In ${inWochen} Wochen: vom ${wann}`;
  if (inWochen === 0) text = `Läuft gerade: vom ${wann}`;
  if (inWochen === 1) text = `Nächste Woche: vom ${wann}`;

  const termin = document.createElement("p");
  termin.className = "card__termin";
  termin.textContent = text;
  ueberschrift.after(termin);
});

// Die strukturierten Daten für Suchmaschinen nennen dieselbe Ausstellung.
const jsonLd = document.querySelector('script[type="application/ld+json"]');
if (jsonLd) {
  const daten = JSON.parse(jsonLd.textContent);
  const ereignis = daten["@graph"]?.find((eintrag) => eintrag["@type"] === "ExhibitionEvent");
  if (ereignis) {
    ereignis.name = aktuell.titel;
    ereignis.description = aktuell.einfuehrung;
    ereignis.startDate = isoDatum(montag);
    ereignis.endDate = isoDatum(sonntagDerWoche(montag));
    jsonLd.textContent = JSON.stringify(daten, null, 2);
  }
}
