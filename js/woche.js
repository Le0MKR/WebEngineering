/* Wochenlogik: Welche Ausstellung läuft wann?
 *
 * Alle Besucher sehen dieselbe Ausstellung, denn sie hängt nur vom Datum ab.
 * Gezählt werden fortlaufende Wochen seit Montag, dem 5. Januar 1970. So
 * wiederholt sich auch über Jahreswechsel und Wochen 53 kein Thema, bevor
 * alle an der Reihe waren. Die Woche wechselt in der Nacht zum Montag nach
 * deutscher Zeit, egal wo der Browser steht. */

const TAG_MS = 24 * 60 * 60 * 1000;
const WOCHE_MS = 7 * TAG_MS;
const BEZUGSMONTAG = Date.UTC(1970, 0, 5);

/** Heutiges Datum in Berlin, als Mitternacht UTC (ohne Uhrzeit). */
export function heuteInBerlin(jetzt = new Date()) {
  const teile = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(jetzt);
  const wert = (typ) => Number(teile.find((teil) => teil.type === typ).value);
  return new Date(Date.UTC(wert("year"), wert("month") - 1, wert("day")));
}

/** Montag der Woche, in der das Datum liegt. */
export function montagDerWoche(datum) {
  const wochentag = datum.getUTCDay() || 7; // Montag = 1 … Sonntag = 7
  return new Date(datum.getTime() - (wochentag - 1) * TAG_MS);
}

/** Position des Themas in der Liste für die Woche, in der das Datum liegt. */
export function themaIndex(datum, anzahlThemen) {
  const wochen = Math.round((montagDerWoche(datum).getTime() - BEZUGSMONTAG) / WOCHE_MS);
  return ((wochen % anzahlThemen) + anzahlThemen) % anzahlThemen;
}

/** Sonntag derselben Woche. */
export function sonntagDerWoche(montag) {
  return new Date(montag.getTime() + 6 * TAG_MS);
}

/** Montag, der `wochen` Wochen nach dem angegebenen Montag liegt. */
export function plusWochen(montag, wochen) {
  return new Date(montag.getTime() + wochen * WOCHE_MS);
}

/** Datum als JJJJ-MM-TT, zum Beispiel für JSON-LD. */
export function isoDatum(datum) {
  return datum.toISOString().slice(0, 10);
}

const tagMonat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone: "UTC" });
const tagMonatJahr = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Zeitraum einer Woche in Worten, zum Beispiel „2. bis 8. November 2026“. */
export function zeitraum(montag) {
  const sonntag = sonntagDerWoche(montag);
  let von;
  if (montag.getUTCMonth() === sonntag.getUTCMonth()) {
    von = `${montag.getUTCDate()}.`;
  } else if (montag.getUTCFullYear() === sonntag.getUTCFullYear()) {
    von = tagMonat.format(montag);
  } else {
    von = tagMonatJahr.format(montag);
  }
  return `${von} bis ${tagMonatJahr.format(sonntag)}`;
}
