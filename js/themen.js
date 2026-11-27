/* Die 15 Themen der Wochenausstellungen, in der Reihenfolge der Rotation.
 * Dieselben Texte stehen als HTML in ausstellungen.html; wer hier etwas ändert,
 * ändert es dort auch. */

export const themen = [
  {
    slug: "impressionismus",
    titel: "Impressionismus",
    einfuehrung:
      "Licht, Farbe und der flüchtige Augenblick: Die Impressionisten malten nicht, was sie über die Welt wussten, sondern wie sie sie in einem Moment sahen. Das Art Institute besitzt eine der bedeutendsten Sammlungen dieser Bewegung außerhalb Frankreichs.",
  },
  {
    slug: "japanische-farbholzschnitte",
    titel: "Japanische Farbholzschnitte",
    einfuehrung:
      "Schauspieler, Reisende, Wellen und Berge: Die Drucke der „fließenden Welt“ aus der Edo-Zeit waren Massenware für die Städte Japans. In Europa veränderten sie später den Blick einer ganzen Künstlergeneration.",
  },
  {
    slug: "kuenstlerinnen",
    titel: "Künstlerinnen",
    einfuehrung:
      "Sie wurden von Akademien ausgeschlossen, übersehen oder unter fremdem Namen geführt und haben sich trotzdem durchgesetzt. Diese Ausstellung zeigt Werke von Frauen aus mehreren Jahrhunderten.",
  },
  {
    slug: "tiere-in-der-kunst",
    titel: "Tiere in der Kunst",
    einfuehrung:
      "Begleiter, Symbol, Studienobjekt: Wenn Künstler Tiere darstellen, erzählen sie oft ebenso viel über die Menschen ihrer Zeit.",
  },
  {
    slug: "wasser-und-meer",
    titel: "Wasser und Meer",
    einfuehrung:
      "Stille Teiche, Häfen, Stürme auf hoher See: Kaum ein Motiv verlangt so viel Können wie Wasser, das sich in jedem Augenblick verändert.",
  },
  {
    slug: "nacht-und-daemmerung",
    titel: "Nacht und Dämmerung",
    einfuehrung:
      "Wenn das Licht schwindet, beginnt eine eigene Malerei: Laternen, Mondschein und die letzten Farben des Tages.",
  },
  {
    slug: "portraets",
    titel: "Porträts",
    einfuehrung:
      "Gesichter aus fünf Jahrhunderten und die Frage, wie viel ein Bild über einen Menschen verraten kann und wie viel es verbergen soll.",
  },
  {
    slug: "stillleben",
    titel: "Stillleben",
    einfuehrung:
      "Früchte, Blumen, Gläser und Bücher: Hinter scheinbar einfachen Arrangements stecken oft Symbole für Reichtum, Genuss und Vergänglichkeit.",
  },
  {
    slug: "leben-in-der-stadt",
    titel: "Leben in der Stadt",
    einfuehrung:
      "Boulevards, Bahnhöfe, Cafés: Mit dem Wachstum der Städte im 19. Jahrhundert entdeckte die Kunst das moderne Leben auf der Straße.",
  },
  {
    slug: "gaerten-und-blumen",
    titel: "Gärten und Blumen",
    einfuehrung:
      "Vom sorgfältig angelegten Beet bis zur wilden Wiese: Gärten waren Rückzugsorte, Statussymbole und für manche Künstler ein Lebenswerk.",
  },
  {
    slug: "mythen-und-goetter",
    titel: "Mythen und Götter",
    einfuehrung:
      "Helden, Göttinnen und Verwandlungen: Die Geschichten der Antike lieferten der Kunst über Jahrhunderte ihren Stoff.",
  },
  {
    slug: "musik-in-bildern",
    titel: "Musik in Bildern",
    einfuehrung:
      "Lauten, Klaviere, Tänze und Konzerte: Wie malt man etwas, das man eigentlich nur hören kann?",
  },
  {
    slug: "winter-und-schnee",
    titel: "Winter und Schnee",
    einfuehrung:
      "Schnee verwandelt vertraute Orte und stellt Künstler vor eine besondere Aufgabe: Weiß zu malen, das niemals nur weiß ist.",
  },
  {
    slug: "arbeit-und-alltag",
    titel: "Arbeit und Alltag",
    einfuehrung:
      "Bauern, Wäscherinnen, Handwerker: Bilder vom gewöhnlichen Leben, das lange nicht als würdig für große Kunst galt.",
  },
  {
    slug: "fruehe-fotografie",
    titel: "Frühe Fotografie",
    einfuehrung:
      "Als Bilder zum ersten Mal ohne Pinsel entstanden: Fotografien aus den ersten Jahrzehnten eines neuen Mediums, zwischen Wissenschaft und Kunst.",
  },
];

/* Abfragen an die API des Art Institute, eine pro Thema (Slug als Schlüssel).
 * Übernommen aus dem Konzept, dort gegen die echte API geprüft: Jede liefert
 * mindestens 36 gemeinfreie Werke mit Bild. `arten` sind die zugelassenen
 * Werkarten, `filter` sind Elasticsearch-Klauseln, die alle zutreffen müssen. */

const MALEREI = "Painting";
const DRUCK = "Print";
const ZEICHNUNG = "Drawing and Watercolor";
const FOTO = "Photograph";

/** Mindestens eines der Schlagworte ist am Werk vergeben. */
const schlagworte = (...worte) => ({ terms: { "subject_titles.keyword": worte } });
/** Der Titel enthält eine der Wortfolgen. */
const imTitel = (...worte) => worte.map((wort) => ({ match_phrase: { title: wort } }));
/** Mindestens eine der Klauseln trifft zu. */
const eines = (...klauseln) => ({ bool: { should: klauseln.flat(), minimum_should_match: 1 } });

/** Die API kennt kein Geschlecht; diese Künstlerinnen haben gemeinfreie Werke mit Bild. */
const kuenstlerinnen = [
  "Mary Cassatt", "Berthe Morisot", "Rosa Bonheur", "Cecilia Beaux", "Lilla Cabot Perry",
  "Eva Gonzalès", "Marie Bracquemond", "Julia Margaret Cameron", "Angelica Kauffmann",
  "Suzanne Valadon", "Gertrude Käsebier", "Paula Modersohn-Becker", "Rosalba Carriera",
];

export const abfragen = {
  impressionismus: {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [{ term: { "style_title.keyword": "Impressionism" } }],
  },
  "japanische-farbholzschnitte": {
    arten: [DRUCK],
    filter: [
      { term: { "place_of_origin.keyword": "japan" } },
      { match_phrase: { medium_display: "woodblock print" } },
      { range: { date_end: { lte: 1868 } } }, // Ende der Edo-Zeit
    ],
  },
  kuenstlerinnen: {
    arten: [MALEREI, DRUCK, ZEICHNUNG, FOTO],
    filter: [{ terms: { "artist_title.keyword": kuenstlerinnen } }],
  },
  "tiere-in-der-kunst": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [schlagworte("animals", "dogs", "dog", "horses", "horse", "birds", "bird", "cats", "cows", "sheep", "lions", "deer", "goats", "donkeys")],
  },
  "wasser-und-meer": {
    arten: [MALEREI, ZEICHNUNG],
    filter: [
      eines(
        schlagworte("boats", "river", "rivers", "seascapes", "sea", "ocean", "waves", "lake", "sailing", "ships", "pond", "beach", "coastal scenes", "storms"),
        imTitel("sea", "seascape", "harbor", "marine", "river", "lake", "pond"),
      ),
    ],
  },
  "nacht-und-daemmerung": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [
      eines(
        schlagworte("night", "night scenes", "moon", "twilight", "evening", "sunset"),
        imTitel("night", "nocturne", "moonlight", "twilight", "evening", "sunset", "dusk", "moonrise"),
      ),
    ],
  },
  portraets: {
    arten: [MALEREI],
    filter: [eines(schlagworte("portraits", "portrait", "formal portraits"), imTitel("portrait"))],
  },
  stillleben: {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [eines(schlagworte("still life", "still lifes"), imTitel("still life"))],
  },
  "leben-in-der-stadt": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [
      eines(
        schlagworte("cityscapes", "urban life", "street scenes", "cities", "city", "street"),
        imTitel("street", "boulevard", "café", "cafe", "gare", "railway"),
      ),
      { range: { date_end: { gte: 1800 } } },
    ],
  },
  "gaerten-und-blumen": {
    arten: [MALEREI, ZEICHNUNG],
    filter: [eines(schlagworte("garden", "gardens", "flowers", "flora"), imTitel("garden", "flowers", "roses", "bouquet"))],
  },
  "mythen-und-goetter": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [
      eines(
        schlagworte("mythology", "mythological figures", "Greek mythology", "gods (deities)", "goddesses", "Greek gods", "Venus"),
        imTitel("Venus", "Apollo", "Diana", "Bacchus", "Hercules", "Jupiter", "Cupid"),
      ),
    ],
  },
  "musik-in-bildern": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [
      eines(
        schlagworte("music", "musicians", "musical instruments", "instruments", "dance", "dancers", "violins"),
        imTitel("concert", "music", "musician", "lute", "piano", "dance", "dancer", "violin", "guitar"),
      ),
    ],
  },
  "winter-und-schnee": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [eines(schlagworte("snow", "winter"), imTitel("snow", "winter", "frost", "skating", "skaters", "ice"))],
  },
  "arbeit-und-alltag": {
    arten: [MALEREI, ZEICHNUNG, DRUCK],
    filter: [
      eines(
        schlagworte("work", "labor", "peasants", "rural life", "farm life", "everyday life (genre)"),
        imTitel("laundress", "peasant", "harvest", "gleaners", "workers", "blacksmith", "haymakers", "sower"),
      ),
    ],
  },
  "fruehe-fotografie": {
    arten: [FOTO],
    filter: [{ range: { date_end: { lte: 1880 } } }],
  },
};
