/* Alle Anfragen an die API des Art Institute of Chicago stehen in dieser Datei.
 *
 * Der Rest der Seite bekommt nur fertige Werk-Objekte (Typ „Artwork“ aus dem
 * Projektkontext) und kennt die rohe Antwort der API nicht.
 * Regeln: nur benötigte Felder (fields), nur gemeinfreie Werke mit Bild,
 * Header AIC-User-Agent bei jeder Anfrage. Doku: https://api.artic.edu/docs/ */

const API = "https://api.artic.edu/api/v1";
const BILDSERVER = "https://www.artic.edu/iiif/2";
const FELDER = "id,title,artist_title,date_display,image_id,thumbnail,artwork_type_title";
const NUR_GEMEINFREI_MIT_BILD = [{ term: { is_public_domain: true } }, { exists: { field: "image_id" } }];

/* Bonus Blatt 7: Dieselbe Anfrage wird eine Minute lang aus dem localStorage
 * beantwortet. Jeder Eintrag trägt eine Versionsnummer und die Uhrzeit. */
const CACHE_PRAEFIX = "artwell.api:";
const CACHE_VERSION = 1;
const EINE_MINUTE = 60 * 1000;

function ausDemCache(pfad) {
  try {
    const eintrag = JSON.parse(localStorage.getItem(CACHE_PRAEFIX + pfad));
    if (eintrag?.version === CACHE_VERSION && Date.now() - eintrag.zeit < EINE_MINUTE) return eintrag.daten;
  } catch {
    // kaputter Eintrag oder kein Speicher (z. B. privates Fenster): einfach neu laden
  }
  return null;
}

function inDenCache(pfad, daten) {
  try {
    // Abgelaufene Einträge zuerst löschen, damit der Speicher nicht voll läuft.
    for (const schluessel of Object.keys(localStorage)) {
      if (schluessel.startsWith(CACHE_PRAEFIX) && !ausDemCache(schluessel.slice(CACHE_PRAEFIX.length))) {
        localStorage.removeItem(schluessel);
      }
    }
    localStorage.setItem(CACHE_PRAEFIX + pfad, JSON.stringify({ version: CACHE_VERSION, zeit: Date.now(), daten }));
  } catch {
    // Speicher voll oder gesperrt: Die Seite funktioniert auch ohne Cache.
  }
}

/** Holt JSON von der API (oder aus dem Cache). Wirft einen Fehler mit verständlicher Meldung. */
async function frage(pfad) {
  const gemerkt = ausDemCache(pfad);
  if (gemerkt) return gemerkt;

  let res;
  try {
    res = await fetch(API + pfad, {
      headers: { "AIC-User-Agent": "Artwell (https://le0mkr.github.io/WebEngineering/)" },
    });
  } catch {
    // fetch selbst scheitert nur, wenn gar keine Antwort kommt (offline, DNS, CORS).
    throw new Error("Die Sammlung ist gerade nicht erreichbar. Bitte die Internetverbindung prüfen und es erneut versuchen.");
  }
  // Bei 404 oder 500 wirft fetch keinen Fehler, deshalb prüfen wir res.ok selbst.
  if (res.status === 429) throw new Error("Zu viele Anfragen in kurzer Zeit. Bitte einen Moment warten und es erneut versuchen.");
  if (!res.ok) throw new Error(`Die Sammlung hat die Anfrage nicht beantwortet (HTTP ${res.status}). Bitte später erneut versuchen.`);
  const daten = await res.json();
  inDenCache(pfad, daten);
  return daten;
}

function suchen(params) {
  return frage(`/artworks/search?params=${encodeURIComponent(JSON.stringify(params))}`);
}

/** Wandelt einen Datensatz der API in ein Werk um; ohne Bild gibt es null. */
function zuWerk(roh) {
  if (!roh.image_id) return null;
  const title = roh.title || "Ohne Titel";
  const artist = roh.artist_title || "";
  const date = roh.date_display || "";
  const bild = roh.thumbnail || {};
  // Fehlt der Alt-Text, bauen wir ihn aus den Daten, z. B. „Painting ‚Paris Street; Rainy Day‘ von Gustave Caillebotte, 1877“.
  const altText =
    bild.alt_text || [`${roh.artwork_type_title || "Werk"} ‚${title}‘`, artist && `von ${artist}`].filter(Boolean).join(" ") + (date ? `, ${date}` : "");
  return {
    id: roh.id,
    title,
    artist,
    date,
    imageId: roh.image_id,
    width: bild.width || 4, // ohne Maße ein Platzhalter im Format 4:3
    height: bild.height || 3,
    altText,
    artworkType: roh.artwork_type_title || "",
  };
}

export function bildUrl(imageId, breite = 400) {
  return `${BILDSERVER}/${imageId}/full/${breite},/0/default.jpg`;
}

/** Bis zu 96 Werke einer Ausstellung, in stabiler Reihenfolge. */
export async function ladeAusstellung(abfrage) {
  const daten = await suchen({
    query: {
      bool: {
        filter: [...NUR_GEMEINFREI_MIT_BILD, { terms: { "artwork_type_title.keyword": abfrage.arten } }, ...abfrage.filter],
      },
    },
    sort: [{ is_boosted: "desc" }, { id: "asc" }],
    fields: FELDER,
    limit: 96,
  });
  return daten.data.map(zuWerk).filter(Boolean);
}

/** Die API liefert höchstens die ersten 10 000 Treffer einer Suche. */
export const MAX_TREFFER = 10000;

export async function suche(begriff, seite, proSeite) {
  if (seite * proSeite > MAX_TREFFER) {
    throw new Error("So weit lässt sich in den Treffern nicht blättern. Ein genauerer Suchbegriff hilft.");
  }
  // q allein sortiert nur nach Relevanz, filtert aber nicht; das erledigt multi_match.
  const daten = await suchen({
    q: begriff,
    query: {
      bool: {
        must: [{ multi_match: { query: begriff, fields: ["title", "artist_title", "term_titles"] } }],
        filter: NUR_GEMEINFREI_MIT_BILD,
      },
    },
    fields: FELDER,
    limit: proSeite,
    page: seite,
  });
  return { werke: daten.data.map(zuWerk).filter(Boolean), gesamt: daten.pagination.total };
}
