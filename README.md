# Artwell – das Online-Museum

Artwell ist ein Online-Museum mit Werken aus der Sammlung des Art Institute of Chicago. Jede Woche öffnet automatisch eine neue Ausstellung zu einem anderen Thema, und zu jedem Bild gibt es Informationen zu Künstler, Entstehung und Hintergrund. Die App richtet sich an Kunstinteressierte, Studierende und alle, die ohne Museumsbesuch Kunst entdecken möchten.

**Live:** https://<euer-name>.github.io/<repo>/
**Team:** Lisa Westenhöfer, Hasan Can, Leo Marker

## Was die App kann

- Jede Woche eine neue Ausstellung zu einem Thema (z. B. „Impressionismus“, „Tiere in der Kunst“, „Künstlerinnen“), die automatisch anhand der Kalenderwoche wechselt
- Die Werke einer Ausstellung als Galerie anzeigen und seitenweise durchblättern
- Eine Detailansicht mit großem Bild, Künstler, Datierung, Technik, Maßen und dem Beschreibungstext des Museums
- Frei in der gesamten Sammlung nach Titel, Künstler oder Stichwort suchen
- Kunstwerke als Favoriten speichern; die Favoritenliste bleibt im Browser (localStorage) erhalten
- *Optional / geplant:* Für Werke ohne Museumstext auf Wunsch eine KI-Beschreibung erzeugen, die deutlich als „KI-generiert, nicht vom Museum geprüft“ gekennzeichnet ist

## Datenquelle

Die App nutzt die öffentliche **Art Institute of Chicago API**, die ohne Registrierung und ohne API-Key zugänglich ist. Laut API umfasst die Sammlung 133.119 Werke (Stand: Oktober 2026).

Abgefragt wird der Endpunkt `/api/v1/artworks/search`. Damit die Antworten klein bleiben, fragen wir über den Parameter `fields` nur die benötigten Felder ab: `id`, `title`, `artist_display`, `date_display`, `medium_display`, `dimensions`, `image_id`, `description`, `short_description`, `thumbnail`, `is_public_domain`, `copyright_notice` sowie für die Ausstellungsthemen `style_titles`, `subject_titles` und `theme_titles`.

Die Bilder werden über den IIIF-Bildserver des Museums geladen; die Bild-URL wird aus `config.iiif_url` und der `image_id` zusammengesetzt. Werke ohne `image_id` werden ausgeblendet. Der Text aus `thumbnail.alt_text` dient als Alternativtext für Screenreader. Bei Werken, die nicht gemeinfrei sind, zeigen wir den `copyright_notice` in der Detailansicht an.

Die Daten werden bei jedem Aufruf live von der API geladen, es gibt keine eigene Zwischenspeicherung. Aktualisierungen der Sammlung übernimmt das Museum selbst.

**Lizenz:** Die Beschreibungstexte (`description`) stehen unter CC-BY 4.0 und werden in der App mit „Text: Art Institute of Chicago“ gekennzeichnet. Alle anderen Daten stehen unter CC0.

Dokumentation: https://api.artic.edu/docs/


## Ausgeschiedene Projektideen
- **Länder-Lexikon (REST Countries):** Es gibt nur ungefähr 250 Länder und die Daten ändern sich fast nie, deshalb hätten wir für Suche und Seiten gar nicht genug Inhalt gehabt.
- **Lebensmittel-Scanner (Open Food Facts):** Spannend wäre die App nur mit Barcode-Scan über die Handykamera gewesen, und das haben wir uns in acht Wochen neben dem Rest nicht zugetraut.
- **Raumfahrt-News-Feed (Spaceflight News API):** Die API gibt zu jedem Artikel nur eine kurze Zusammenfassung und einen Link auf eine andere Seite, also hätte unsere App eigentlich nur Links weitergeleitet.
- **Währungsrechner (Frankfurter):** Mit nur etwa 30 Währungen wäre die Liste sehr kurz gewesen, und im Mittelpunkt hätte eher ein Rechner gestanden als eine Liste, die ja Pflicht ist.

## Lokal starten

Seit Blatt 4 läuft das Projekt mit Vite. Voraussetzung ist Node.js (aktuelle LTS-Version).

```bash
npm install      # einmalig: lädt Vite und Tailwind nach node_modules/
npm run dev      # Entwicklungsserver, Adresse steht im Terminal
npm run build    # fertige Seite nach dist/
npm run preview  # dist/ lokal ansehen
```

Hochgeladen wird nur der Inhalt von `dist/`. `node_modules/` und `dist/` stehen in `.gitignore`; `package-lock.json` ist im Repository, damit alle dieselben Versionen installieren.

## Technik

Womit gebaut und warum. Eine Zeile pro Entscheidung reicht, aber es soll eine Entscheidung sein, keine Aufzählung von Buzzwords.

## KI-Log

Ehrlich ausfüllen, das zählt zur Bewertung.

| Werkzeug | Wofür benutzt |
| --- | --- |
| z. B. Copilot | z. B. Formular-Validierung erklären lassen |

**Ein Fall, in dem KI geholfen hat:** Was habt ihr gefragt, was kam zurück, was habt ihr geändert?

**Ein Fall, in dem KI falsch lag:** Woran habt ihr es gemerkt, wie habt ihr es gelöst?

## Rich Results Test

Das JSON-LD im `head` der Startseite wurde mit dem [Rich Results Test von Google](https://search.google.com/test/rich-results) geprüft.

![Ergebnis des Rich Results Test](rich-results-test.png)

## CSS-Kollision

Die Links in der Navigation werden von zwei Regeln getroffen: `a { color: var(--akzent); }` und `.site-nav a { color: var(--text); }`.
Es gewinnt `.site-nav a`; in den DevTools ist `color` bei der Regel `a` durchgestrichen, die Links sind also textfarben und nicht golden.
Der Grund ist die Spezifität: `.site-nav a` hat eine Klasse und ein Element (0,1,1), `a` nur ein Element (0,0,1). Die Reihenfolge im Stylesheet spielt dabei keine Rolle.

## Komponenten

Drei Bausteine wiederholen sich im Projekt. Alle nutzen denselben Radius (`--radius`) und die Farben aus `:root`; jede Karte hat denselben Innenabstand (1,5 × `--abstand`), jeder Button dieselbe Größe.

| Komponente | Klasse in `style.css` | Wo sie vorkommt |
| --- | --- | --- |
| Button | `.button`, zweitrangig `.button--leise`, mehrere in `.button-bar` | „Vorschlag absenden“ in `ueber.html`, „Alle Ausstellungen ansehen“ und „Mehr über das Projekt“ in `index.html`, beide Links in `danke.html` |
| Karte | `.card` | 15 Themenkarten in `ausstellungen.html`, Formular in `ueber.html`, grüner Kasten „Ausstellung der Woche“ in `index.html` (zusätzlich `.room`) |
| Navbar | `.site-header` mit `.site-nav` | Kopf aller vier Seiten |

## Tailwind-Vergleich

Auf `ausstellungen.html` steht die Karte „Impressionismus“ zweimal: oben unter „Aktuelle Ausstellung“ mit Tailwind-Klassen, unten in der Liste mit eigenem CSS (`.card`, `.badge`). Beide sehen gleich aus. Tailwind kam in Blatt 4 zuerst über das Play CDN und wird jetzt von Vite gebaut (siehe „Build mit Vite und Tailwind“).

| Tailwind-Klasse | CSS-Eigenschaft | Eigenes CSS |
| --- | --- | --- |
| `relative` | `position: relative` | `.card` |
| `rounded-karte` | `border-radius: var(--radius)` | `.card`, `.badge` |
| `border` | `border-width: 1px; border-style: solid` | `.card` |
| `border-linie` | `border-color: var(--linie)` | `.card` |
| `bg-flaeche` | `background-color: var(--flaeche)` | `.card` |
| `p-6` | `padding: 1.5rem` | `.card` (1,5 × `--abstand`) |
| `absolute top-0 right-4` | `position: absolute; top: 0; right: 1rem` | `.badge` |
| `-translate-y-1/2` | `translate: 0 -50%` | `.badge` (`transform: translateY(-50%)`) |
| `px-2` | `padding-inline: 0.5rem` | `.badge` |
| `bg-akzent`, `text-grund` | `background-color: var(--akzent)`, `color: var(--bg)` | `.badge` |
| `font-ui`, `text-klein`, `font-semibold` | `font-family: var(--schrift-sans)`, `font-size: var(--schrift-klein)`, `font-weight: 600` | `.badge` |
| `mt-0`, `mb-4`, `mb-0` | `margin-top: 0`, `margin-bottom: 1rem`, `margin-bottom: 0` | `h3`, `p`, `.card > :last-child` |
| `leading-[1.2]` | `line-height: 1.2` | `h3` |

Die Namen `flaeche`, `linie`, `akzent`, `grund`, `karte`, `ui`, `klein` und `normal` sind keine Tailwind-Standardwerte. Sie werden in `style.css` mit `@theme` auf unsere Variablen gelegt. So nutzen beide Karten dieselben Werte, und der Dunkelmodus gilt auch für die Tailwind-Karte.

Damit beides zusammenpasst, steht `style.css` in der Ebene `@layer eigen`: Tailwinds Grundstile verlieren gegen unser CSS, Tailwinds Utility-Klassen gewinnen.

## Build mit Vite und Tailwind

`npm run build` erzeugt in `dist/` die vier HTML-Seiten, `robots.txt`, `sitemap.xml` und `llms.txt` (aus `public/`) sowie in `dist/assets/` eine CSS- und eine JavaScript-Datei mit einem Hash im Namen.

Die CSS-Datei ist **11,6 kB groß, komprimiert (gzip) 3,3 kB**. Davon stammen etwa 6,4 kB von Tailwind, der Rest ist unser eigenes CSS.

Sie bleibt so klein, obwohl Tailwind tausende Klassen kennt, weil Tailwind beim Build die Projektdateien durchsucht und nur die Klassen erzeugt, die dort wirklich vorkommen. Bei uns sind das gut 20 Klassen der Vergleichskarte. Dazu kommen Tailwinds Grundstile (Preflight) und die verwendeten Theme-Variablen. Außerdem entfernt Vite beim Build Kommentare und Leerzeichen.
