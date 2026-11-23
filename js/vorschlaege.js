/* Themenvorschläge auf der Über-Seite.
 *
 * Das Formular schickt nichts ab und lädt nicht neu: JavaScript fängt das
 * Absenden ab, prüft die Eingabe und hängt den Vorschlag an eine Liste.
 * Alles, was die Anzeige bestimmt, steht im Objekt `zustand`. Jede Änderung
 * läuft über aendere(), das speichert und danach zeichne() aufruft. So passen
 * Liste, Zähler, Filter und Meldung immer zusammen, auch nach dem Löschen.
 *
 * Die Vorschläge bleiben über den Reload hinweg im localStorage dieses
 * Browsers. Ohne JavaScript funktioniert das Formular wie vorher und führt
 * zu danke.html. */

const formular = document.querySelector("#vorschlag-form");
const liste = document.querySelector("#vorschlag-liste");
const zaehler = document.querySelector("#vorschlag-zaehler");
const meldung = document.querySelector("#vorschlag-meldung");
const filterFeld = document.querySelector("#vorschlag-filter");

// Steht eine andere Version im Speicher, passt sie nicht mehr zum Code und wird ignoriert.
const SPEICHER_SCHLUESSEL = "artwell.vorschlaege";
const SPEICHER_VERSION = 1;

const zustand = {
  vorschlaege: [], // { id, thema, name, woche, begruendung }
  filter: "",
  meldung: "",
};

/** Ändert den Zustand, speichert die Vorschläge und zeichnet neu. */
function aendere(aenderung) {
  Object.assign(zustand, aenderung);
  speichere();
  zeichne();
}

/** Vorschläge, die zum Filter passen. */
function sichtbareVorschlaege() {
  const suche = zustand.filter.trim().toLowerCase();
  if (!suche) return zustand.vorschlaege;
  return zustand.vorschlaege.filter(
    (vorschlag) =>
      vorschlag.thema.toLowerCase().includes(suche) || vorschlag.begruendung.toLowerCase().includes(suche),
  );
}

/** Baut die ganze Anzeige aus dem Zustand neu. */
function zeichne() {
  const sichtbar = sichtbareVorschlaege();
  liste.replaceChildren(...sichtbar.map(baueEintrag));

  const anzahl = zustand.vorschlaege.length;
  if (anzahl === 0) zaehler.textContent = "Noch keine Vorschläge.";
  else if (zustand.filter.trim()) zaehler.textContent = `${sichtbar.length} von ${anzahl} Vorschlägen passen zum Filter.`;
  else if (anzahl === 1) zaehler.textContent = "1 Vorschlag";
  else zaehler.textContent = `${anzahl} Vorschläge`;

  meldung.textContent = zustand.meldung;
  if (filterFeld && filterFeld.value !== zustand.filter) filterFeld.value = zustand.filter;
}

/** Ein Listeneintrag. Nur textContent, damit Eingaben nie als HTML ausgeführt werden. */
function baueEintrag(vorschlag) {
  const eintrag = document.createElement("li");
  eintrag.className = "card";

  const kopf = document.createElement("div");
  kopf.className = "vorschlag__kopf";

  const titel = document.createElement("h4");
  titel.textContent = vorschlag.thema;

  const entfernen = document.createElement("button");
  entfernen.type = "button";
  entfernen.className = "button button--leise";
  entfernen.textContent = "Entfernen";
  entfernen.setAttribute("aria-label", `„${vorschlag.thema}“ entfernen`);
  entfernen.addEventListener("click", () => loesche(vorschlag.id));

  kopf.append(titel, entfernen);

  const herkunft = document.createElement("p");
  herkunft.className = "vorschlag__herkunft";
  herkunft.textContent = vorschlag.woche
    ? `Vorgeschlagen von ${vorschlag.name} für Kalenderwoche ${vorschlag.woche}`
    : `Vorgeschlagen von ${vorschlag.name}`;

  eintrag.append(kopf, herkunft);

  if (vorschlag.begruendung) {
    const begruendung = document.createElement("p");
    begruendung.textContent = vorschlag.begruendung;
    eintrag.append(begruendung);
  }
  return eintrag;
}

function loesche(id) {
  const vorschlag = zustand.vorschlaege.find((eintrag) => eintrag.id === id);
  if (!vorschlag) return;
  aendere({
    vorschlaege: zustand.vorschlaege.filter((eintrag) => eintrag.id !== id),
    meldung: `„${vorschlag.thema}“ wurde entfernt.`,
  });
  // Der Fokus lag auf dem gelöschten Button; er springt zurück zum Filter.
  filterFeld?.focus();
}

/** Liest das Formular aus und prüft, was der Browser nicht prüfen kann. */
function leseFormular() {
  const daten = new FormData(formular);
  const vorschlag = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    thema: String(daten.get("thema") ?? "").trim(),
    name: String(daten.get("name") ?? "").trim(),
    woche: daten.get("woche") ? Number(daten.get("woche")) : null,
    begruendung: String(daten.get("begruendung") ?? "").trim(),
  };
  // Die E-Mail-Adresse wird nur geprüft, aber nirgends angezeigt oder gespeichert.

  if (vorschlag.thema.length < 3) return { fehler: "Das Thema braucht mindestens 3 Zeichen (ohne Leerzeichen am Rand)." };
  if (vorschlag.name.length < 2) return { fehler: "Der Name braucht mindestens 2 Zeichen." };

  const schonDa = zustand.vorschlaege.some(
    (vorhanden) => vorhanden.thema.toLowerCase() === vorschlag.thema.toLowerCase(),
  );
  if (schonDa) return { fehler: `„${vorschlag.thema}“ steht schon auf der Liste.` };

  return { vorschlag };
}

// --- Speichern über den Reload hinweg ---------------------------------

function speichere() {
  try {
    const daten = { version: SPEICHER_VERSION, vorschlaege: zustand.vorschlaege };
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(daten));
  } catch {
    // Privates Fenster oder Speicher voll: Die Seite funktioniert trotzdem, nur ohne Erinnerung.
  }
}

/** Passt ein gespeicherter Eintrag noch zu unserem Code? */
function istGueltigerVorschlag(eintrag) {
  return (
    typeof eintrag === "object" &&
    eintrag !== null &&
    typeof eintrag.id === "string" &&
    typeof eintrag.thema === "string" &&
    eintrag.thema.trim().length >= 3 &&
    typeof eintrag.name === "string" &&
    typeof eintrag.begruendung === "string" &&
    (eintrag.woche === null || (Number.isInteger(eintrag.woche) && eintrag.woche >= 1 && eintrag.woche <= 53))
  );
}

/** Liest gespeicherte Vorschläge. Alles, was nicht passt, wird verworfen statt die Seite zu stören. */
function lade() {
  let roh;
  try {
    roh = localStorage.getItem(SPEICHER_SCHLUESSEL);
  } catch {
    return { vorschlaege: [], meldung: "" };
  }
  if (roh === null) return { vorschlaege: [], meldung: "" };

  try {
    const daten = JSON.parse(roh);
    if (daten?.version !== SPEICHER_VERSION || !Array.isArray(daten.vorschlaege)) {
      throw new Error("Unbekanntes Format");
    }
    const gueltig = daten.vorschlaege.filter(istGueltigerVorschlag);
    const verworfen = daten.vorschlaege.length - gueltig.length;
    return {
      vorschlaege: gueltig,
      meldung: verworfen > 0 ? `${verworfen} gespeicherte Einträge waren beschädigt und wurden entfernt.` : "",
    };
  } catch {
    // Kaputtes JSON oder altes Format: neu anfangen und den alten Eintrag überschreiben.
    return { vorschlaege: [], meldung: "Die gespeicherten Vorschläge passten nicht mehr und wurden zurückgesetzt." };
  }
}

// --- Start ----------------------------------------------------------

export function starteVorschlaege() {
  if (!formular || !liste || !zaehler || !meldung) return;

  formular.addEventListener("submit", (event) => {
    // Der Browser hat Pflichtfelder, E-Mail und Zahlenbereich schon geprüft.
    event.preventDefault();

    const { vorschlag, fehler } = leseFormular();
    if (fehler) {
      aendere({ meldung: fehler });
      return;
    }
    aendere({
      vorschlaege: [...zustand.vorschlaege, vorschlag],
      filter: "", // damit der neue Vorschlag sichtbar ist
      meldung: `„${vorschlag.thema}“ wurde hinzugefügt.`,
    });
    formular.reset();
  });

  filterFeld?.addEventListener("input", () => {
    aendere({ filter: filterFeld.value, meldung: "" });
  });

  const geladen = lade();
  aendere(geladen); // speichert gleich wieder, damit kaputte Einträge verschwinden
}
