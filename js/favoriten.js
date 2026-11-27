/* Favoriten: gemerkte Werke, nur in diesem Browser (localStorage).
 *
 * Gespeichert wird alles, was die Galerie zum Anzeigen braucht. So
 * funktioniert die Favoritenseite auch, wenn die API nicht erreichbar ist.
 * Wie bei den Themenvorschlägen: Versionsnummer, try/catch, und beim Laden
 * wird jeder Eintrag geprüft; Unpassendes fliegt raus. */

const SCHLUESSEL = "artwell.favoriten";
const VERSION = 1;

function istGueltig(werk) {
  return (
    Number.isInteger(werk?.id) &&
    typeof werk.title === "string" &&
    typeof werk.artist === "string" &&
    typeof werk.date === "string" &&
    typeof werk.imageId === "string" &&
    typeof werk.altText === "string" &&
    werk.width > 0 &&
    werk.height > 0
  );
}

export function ladeFavoriten() {
  try {
    const gespeichert = JSON.parse(localStorage.getItem(SCHLUESSEL));
    if (gespeichert?.version !== VERSION || !Array.isArray(gespeichert.werke)) return [];
    return gespeichert.werke.filter(istGueltig);
  } catch {
    return []; // kaputter Speicher oder privates Fenster
  }
}

function speichere(werke) {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify({ version: VERSION, werke }));
  } catch {
    // Speicher gesperrt (z. B. privates Fenster): Dann lässt sich nichts merken.
  }
}

export function istFavorit(id) {
  return ladeFavoriten().some((werk) => werk.id === id);
}

/** Merkt ein Werk oder entfernt es wieder. Gibt zurück, ob es jetzt Favorit ist. */
export function schalteFavorit(werk) {
  const werke = ladeFavoriten();
  if (istFavorit(werk.id)) {
    speichere(werke.filter((eintrag) => eintrag.id !== werk.id));
    return false;
  }
  const { id, title, artist, date, imageId, width, height, altText } = werk;
  speichere([{ id, title, artist, date, imageId, width, height, altText }, ...werke]);
  return true;
}
