// Einstieg für alle Seiten. Vite bündelt diese Datei mit den Modulen aus js/.
// Ohne JavaScript bleibt jede Seite lesbar: Dann steht dort der Text aus dem HTML.

import { themen } from "./js/themen.js";
import { heuteInBerlin, isoDatum, montagDerWoche, sonntagDerWoche, themaIndex, zeitraum } from "./js/woche.js";

const jahr = document.querySelector("#jahr");
if (jahr) jahr.textContent = new Date().getFullYear();

// --- Ausstellung der Woche -------------------------------------------

const heute = heuteInBerlin();
const montag = montagDerWoche(heute);
const aktuell = themen[themaIndex(heute, themen.length)];

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
