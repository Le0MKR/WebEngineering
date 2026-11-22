/* Themenvorschläge auf der Über-Seite.
 *
 * Das Formular schickt nichts ab und lädt nicht neu: JavaScript fängt das
 * Absenden ab, prüft die Eingabe und hängt den Vorschlag an eine Liste.
 * Alles, was die Anzeige bestimmt, steht im Objekt `zustand`. Jede Änderung
 * läuft über zeichne(), damit Liste, Zähler und Meldung immer zusammenpassen.
 *
 * Ohne JavaScript funktioniert das Formular wie vorher und führt zu danke.html. */

const formular = document.querySelector("#vorschlag-form");
const liste = document.querySelector("#vorschlag-liste");
const zaehler = document.querySelector("#vorschlag-zaehler");
const meldung = document.querySelector("#vorschlag-meldung");

const zustand = {
  vorschlaege: [], // { id, thema, name, woche, begruendung }
  meldung: "",
};

/** Baut die ganze Anzeige aus dem Zustand neu. */
function zeichne() {
  liste.replaceChildren(...zustand.vorschlaege.map(baueEintrag));

  const anzahl = zustand.vorschlaege.length;
  if (anzahl === 0) zaehler.textContent = "Noch keine Vorschläge.";
  else if (anzahl === 1) zaehler.textContent = "1 Vorschlag";
  else zaehler.textContent = `${anzahl} Vorschläge`;

  meldung.textContent = zustand.meldung;
}

/** Ein Listeneintrag. Nur textContent, damit Eingaben nie als HTML ausgeführt werden. */
function baueEintrag(vorschlag) {
  const eintrag = document.createElement("li");
  eintrag.className = "card";

  const titel = document.createElement("h4");
  titel.textContent = vorschlag.thema;

  const herkunft = document.createElement("p");
  herkunft.className = "vorschlag__herkunft";
  herkunft.textContent = vorschlag.woche
    ? `Vorgeschlagen von ${vorschlag.name} für Kalenderwoche ${vorschlag.woche}`
    : `Vorgeschlagen von ${vorschlag.name}`;

  eintrag.append(titel, herkunft);

  if (vorschlag.begruendung) {
    const begruendung = document.createElement("p");
    begruendung.textContent = vorschlag.begruendung;
    eintrag.append(begruendung);
  }
  return eintrag;
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

export function starteVorschlaege() {
  if (!formular || !liste || !zaehler || !meldung) return;

  formular.addEventListener("submit", (event) => {
    // Der Browser hat Pflichtfelder, E-Mail und Zahlenbereich schon geprüft.
    event.preventDefault();

    const { vorschlag, fehler } = leseFormular();
    if (fehler) {
      zustand.meldung = fehler;
    } else {
      zustand.vorschlaege = [...zustand.vorschlaege, vorschlag];
      zustand.meldung = `„${vorschlag.thema}“ wurde hinzugefügt.`;
      formular.reset();
    }
    zeichne();
  });

  zeichne();
}
