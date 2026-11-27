# Artwell – das Online-Museum

Artwell ist ein Online-Museum mit Werken aus der Sammlung des Art Institute of Chicago. Jede Woche öffnet automatisch eine neue Ausstellung zu einem anderen Thema, und zu jedem Bild gibt es Informationen zu Künstler, Entstehung und Hintergrund. Die App richtet sich an Kunstinteressierte, Studierende und alle, die ohne Museumsbesuch Kunst entdecken möchten.

**Live:** https://le0mkr.github.io/WebEngineering/
**Team:** Lisa Westenhöfer, Hasan Can, Leo Marker

![Startseite von Artwell mit der Ausstellung der Woche](docs/screenshot-start.png)

## Was Artwell heute kann

- **Ausstellung der Woche:** Jeden Montag (nach deutscher Zeit) ist automatisch das nächste von 15 Themen an der Reihe, für alle Besucher gleich.
- **Werke aus der Sammlung:** Die Startseite lädt die Werke der Ausstellung live aus der API des Art Institute of Chicago und zeigt sie als Galerie mit Museumstafel, 24 pro Seite.
- **Suche:** frei in der ganzen Sammlung nach Titel, Künstler oder Stichwort suchen; gesucht wird 300 ms nach dem letzten Tastendruck.
- **Werkseite:** großes Bild (Klick öffnet die volle Größe), Künstler, Datierung, Werkart, Technik, Maße, Sammlung, der Text des Museums sowie Quelle und Lizenz.
- **Favoriten:** Werke auf der Werkseite merken; die Liste bleibt in diesem Browser gespeichert und funktioniert auch ohne Verbindung zur API.
- **Alle Ausstellungen:** Übersicht der 15 Themen mit Einführungstext und dem nächsten Termin; die laufende Ausstellung ist markiert.
- **Thema vorschlagen:** Vorschläge erscheinen ohne Neuladen in einer Liste mit Zähler, lassen sich filtern und entfernen und bleiben in diesem Browser gespeichert. Verschickt wird nichts.
- **Für alle Geräte:** funktioniert vom Handy bis zum großen Bildschirm, hell und dunkel, vollständig per Tastatur bedienbar.

## Was noch kommt

- Impressum und Datenschutzerklärung ausfüllen (die Seiten stehen, Platzhalter in eckigen Klammern) und mit der Lehrkraft abstimmen
- *Optional / geplant:* Für Werke ohne Museumstext auf Wunsch eine KI-Beschreibung erzeugen, die deutlich als „KI-generiert, nicht vom Museum geprüft“ gekennzeichnet ist

## Datenquelle

Die App nutzt die öffentliche **Art Institute of Chicago API**, die ohne Registrierung und ohne API-Key zugänglich ist. Laut API umfasst die Sammlung 133.119 Werke (Stand: Oktober 2026).

Alle Anfragen stehen in `js/api.js`. Eine Ausstellung ist eine einzige Anfrage an `/api/v1/artworks/search` mit bis zu 96 Werken. Die Abfrage jedes Themas steht in `js/themen.js` (`abfragen`), übernommen aus unserem Konzept, wo jede gegen die API geprüft wurde. Über `fields` fragen wir nur die Felder ab, die die Galerie braucht: `id`, `title`, `artist_title`, `date_display`, `image_id`, `thumbnail` und `artwork_type_title`. Die Werkseite holt mit `/api/v1/artworks/{id}` zusätzlich `medium_display`, `dimensions`, `description`, `credit_line` und `is_public_domain`. Jede Anfrage filtert auf gemeinfreie Werke (`is_public_domain`) mit Bild (`image_id`) und schickt den Header `AIC-User-Agent`, wie es die Doku verlangt.

Die Bilder kommen vom IIIF-Bildserver des Museums: `https://www.artic.edu/iiif/2/{image_id}/full/400,/0/default.jpg`. Der Text aus `thumbnail.alt_text` dient als Alternativtext; fehlt er, setzt `js/api.js` ihn aus Werkart, Titel, Künstler und Jahr zusammen.

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
npm install      # einmalig: lädt Vite, Tailwind und DOMPurify nach node_modules/
npm run dev      # Entwicklungsserver unter http://[::1]:5173
npm run build    # fertige Seite nach dist/
npm run preview  # dist/ lokal ansehen
```

Hochgeladen wird nur der Inhalt von `dist/`. Das erledigt die GitHub Action in `.github/workflows/pages.yml`: Bei jedem Push auf `main` baut sie die Seite und veröffentlicht `dist/` auf GitHub Pages. `node_modules/` und `dist/` stehen in `.gitignore`; `package-lock.json` ist im Repository, damit alle dieselben Versionen installieren.

## Technik

Womit gebaut und warum. Eine Zeile pro Entscheidung reicht, aber es soll eine Entscheidung sein, keine Aufzählung von Buzzwords.

## KI-Log

| Werkzeug | Wofür benutzt |
| --- | --- |
| Claude Code | Code für die Übungsblätter vorschlagen, Aufgaben in drei Teile aufteilen, Seiten mit Lighthouse und im Browser prüfen |

**Ein Fall, in dem KI geholfen hat:** Für Blatt 5 sollte die Seite zeigen, welche Ausstellung diese Woche läuft. Die KI hat die Wochen fortlaufend seit einem festen Montag gezählt statt mit der Kalenderwoche zu rechnen. Dadurch springt die Reihe auch zum Jahreswechsel und in Jahren mit 53 Wochen nicht. Wir haben das mit Daten nachgeprüft, deren Thema wir kannten (damals 5. Oktober: Porträts, 12. Oktober: Stillleben). Seit Blatt 7 beginnt die Reihe am 23. November 2026 von vorn mit Impressionismus; dafür musste nur der Bezugsmontag in `js/woche.js` geändert werden.

**Ein Fall, in dem die KI falsch lag:** Beim Umbau für Blatt 4 hat die KI in `style.css` einen Kommentar mit einem doppelten `*/` geschrieben. Dadurch wurde die Regel danach, die für den klebenden Kopf, ungültig. Gemerkt haben wir es an der Warnung „Unexpected token“ beim `npm run build`. Behoben wurde es vor dem Commit, seitdem lesen wir die Build-Ausgabe jedes Mal.

**Noch ein Fall, in dem die KI falsch lag:** Der erste Vite-Build hatte absolute Pfade (`/assets/…`). Als wir `dist/` in einem Unterordner geöffnet haben, wie später auf GitHub Pages, war die Seite ungestylt, weil CSS und JavaScript eine 404 lieferten. Die Lösung war `base: './'` in `vite.config.js`.

**Ein Fall aus Blatt 7, in dem die KI falsch lag:** Die Suche aus dem KI-gebauten Konzept schickte den Suchbegriff als `q` zusammen mit einer Abfrage, die nur filtert. Die API sortiert dann nach Relevanz, filtert aber nicht nach dem Begriff: Jede Suche meldete rund 59.000 Treffer, auch Unsinn wie „xqzzyyq“. Aufgefallen ist es beim Test des Leer-Zustands (A3). Gelöst ist es mit einer `multi_match`-Abfrage auf Titel, Künstler und Schlagworte in `js/api.js`; `q` sorgt weiter für die Reihenfolge.

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

Auf `ausstellungen.html` steht die Karte der aktuellen Ausstellung zweimal: oben unter „Aktuelle Ausstellung“ mit Tailwind-Klassen, unten in der Liste mit eigenem CSS (`.card`, `.badge`). Beide sehen gleich aus; nur die Terminzeile, die JavaScript seit Blatt 5 einträgt, steht allein in der Liste. Tailwind kam in Blatt 4 zuerst über das Play CDN und wird jetzt von Vite gebaut (siehe „Build mit Vite und Tailwind“).

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

## Lokal und live

Die Seite sah lokal und auf GitHub Pages von Anfang an gleich aus, und im Network-Tab der Live-Seite kommt kein Request mit 4xx oder 5xx zurück. Diese drei Fallen haben wir vorher vermieden:

1. **Pfade:** Live liegt die Seite unter `/WebEngineering/`, lokal unter `/`. Vite baut deshalb mit `base: './'`, also mit relativen Pfaden (`./assets/…`). Mit absoluten Pfaden (`/assets/…`) hätten CSS und JavaScript auf `le0mkr.github.io/assets/…` gezeigt und eine 404 geliefert; genau das ist uns beim ersten Probe-Build in einem Unterordner passiert.
2. **Groß- und Kleinschreibung:** Alle Dateinamen sind klein und ohne Umlaute (`ueber.html`, `favicon.svg`), und jeder Link schreibt sie genauso. Windows unterscheidet das nicht, der Server von GitHub Pages schon.
3. **Favicon:** Ohne Angabe fragt der Browser `/favicon.ico` an der Wurzel der Domain an, also außerhalb unseres Repos, und bekommt eine 404. Jede Seite verlinkt deshalb ihr eigenes `favicon.svg`.

## Keine Geheimnisse im Repo

Wir haben das Repository samt der ganzen Git-Historie nach API-Keys, Passwörtern und Tokens durchsucht (`git grep -iE "api[_-]?key|secret|token|passw" $(git rev-list --all)`). Gefunden wurde nur der Satz „ohne API-Key“ in dieser README. Die API des Art Institute braucht keinen Schlüssel, eine `.env` gibt es bisher nicht und wurde nie committet. Falls später doch ein Geheimnis dazukommt, gehört es in `.env`; die Datei steht schon in `.gitignore`.

## Mini-Server (Bonus)

Im Ordner `server/` liegt ein kleiner Node-Server ohne zusätzliche Pakete. Er nutzt dieselben Themen (`js/themen.js`) und dieselbe Wochenlogik (`js/woche.js`) wie die Seite.

```bash
npm run server   # startet auf http://localhost:3000
```

| Route | Antwort |
| --- | --- |
| `/api/themen` | alle 15 Themen |
| `/api/themen?suche=wasser` | nur Themen, deren Titel oder Einführung den Suchbegriff enthält (eigene Route mit gefilterten Daten) |
| `/api/themen/aktuell` | das Thema dieser Woche mit Start- und Enddatum |

Ein eigener Server ist nötig, sobald etwas geheim bleiben oder bei jeder Anfrage neu berechnet werden muss, etwa ein API-Schlüssel, eine Datenbank oder gespeicherte Formulareingaben. Solange alle Dateien für alle Besucher gleich sind und der Browser den Rest selbst erledigt, wie bei Artwell mit der offenen Museums-API, reicht GitHub Pages.

## Interaktion (Blatt 6)

Das Formular „Thema vorschlagen“ auf `ueber.html` lädt nicht neu: `js/vorschlaege.js` fängt das `submit`-Event ab (`event.preventDefault()`), liest die Felder mit `FormData`, prüft sie und schreibt das Ergebnis mit `textContent` in die Seite. Ohne JavaScript führt das Formular wie früher zu `danke.html`.

- **Ein Zustand:** Alles, was die Anzeige bestimmt, steht im Objekt `zustand` (`vorschlaege`, `filter`, `meldung`).
- **Eine Zeichenfunktion:** `zeichne()` baut Liste, Zähler, Filter und Meldung jedes Mal komplett aus dem Zustand. Jede Änderung (hinzufügen, entfernen, filtern) läuft über `aendere()`, das speichert und dann `zeichne()` aufruft. Deshalb passen Liste und Zähler auch nach dem Löschen zusammen („1 von 3 Vorschlägen passen zum Filter“).
- **Über den Reload hinweg (Bonus):** Die Vorschläge stehen im `localStorage` unter `artwell.vorschlaege`, zusammen mit einer Versionsnummer. Beim Start wird alles geprüft: kaputtes JSON, eine andere Version oder Einträge mit falschen Feldern werden verworfen, und die Seite sagt das in einem Satz, statt abzustürzen. Klappt der Zugriff gar nicht (privates Fenster), läuft die Seite ohne Speicher weiter.
- **Fehlersuche:** Die Notizen zu den fünf Fehlern aus dem Baustein `t6-fehlersuche` stehen in [`notizen/fehlersuche.md`](notizen/fehlersuche.md).

## Echte Daten (Blatt 7)

### A1: Die API vor der ersten Zeile Code

Geprüft mit `curl` und im Browser (Rohdaten von `https://api.artic.edu/api/v1/artworks/search?...`), nicht nur aus der Doku abgeschrieben:

1. **Key?** Nein. Die API ist offen, es gibt nichts Geheimes. Gewünscht ist nur der Header `AIC-User-Agent` mit einem Namen und einer Kontaktmöglichkeit; wir schicken `Artwell (https://le0mkr.github.io/WebEngineering/)`.
2. **Wie viele Anfragen?** 60 pro Minute und IP-Adresse, also höchstens 3.600 pro Stunde. Die Antwort nennt das selbst im Header `x-ratelimit-limit: 60`. Wer darüber liegt, bekommt HTTP 429.
3. **CORS?** Ja: Die Antwort enthält `access-control-allow-origin: *`, der Browser darf die Daten also von unserer Domain aus lesen. Wir brauchen keinen eigenen Server dazwischen.
4. **Die drei wichtigsten Felder:** `image_id` (ohne Bild kein Werk in der Galerie), `title` und `artist_title` für die Tafel unter dem Bild.

Eine Falle haben wir beim Testen gefunden: Der Bildserver antwortet mit 403, wenn die Seite über `localhost` läuft. Deshalb startet `npm run dev` jetzt unter `http://[::1]:5173` (Einstellung `server.host` in `vite.config.js`).

### A2 und A3: fetch und die vier Zustände

`js/api.js` holt die Daten mit `async`/`await`, prüft `res.ok` und macht aus jedem Problem einen Fehler mit verständlichem Text. `js/galerie.js` hält wie die Themenvorschläge alles in einem `zustand` und zeichnet daraus die Anzeige:

| Fall | Was man sieht | So führen wir es vor |
|---|---|---|
| lädt | „Lade Werke …“ über der leeren Galerie | DevTools → Network → Throttling „Slow 3G“, Seite neu laden |
| Daten da | Galerie mit „Werke 1 bis 24 von 96“, Blättern per „Weiter“ | Startseite normal öffnen |
| nichts gefunden | „Für diese Ausstellung wurden keine Werke gefunden.“ | Startseite mit `?seite=99` öffnen (diese Seite gibt es nicht) |
| Fehler | Meldung ohne Stacktrace und Button „Erneut versuchen“ | DevTools → Network → „Offline“ oder die Anfrage an `api.artic.edu` blockieren (Rechtsklick → „Block request URL“) |

Ein falscher Pfad (z. B. `/artworkz` statt `/artworks`) ergibt HTTP 404. `fetch` wirft dabei keinen Fehler, aber `res.ok` ist `false`, und die Seite zeigt „Die Sammlung hat die Anfrage nicht beantwortet (HTTP 404) …“ statt einer leeren Fläche.

### Bonus: Debounce und Cache

Beides ist eingebaut, damit wir die API (60 Anfragen pro Minute) und die Geduld der Besucher schonen:

- **Debounce** auf `suche.html`: Gesucht wird erst 300 ms nach dem letzten Tastendruck (`setTimeout` in `app.js`, jeder neue Tastendruck setzt die Wartezeit mit `clearTimeout` zurück). Kommt eine ältere Antwort trotzdem später an als eine neuere, verwirft `js/galerie.js` sie.
- **Cache** in `js/api.js`: Jede Antwort landet mit Uhrzeit und Versionsnummer im `localStorage`. Dieselbe Anfrage innerhalb einer Minute wird von dort beantwortet; abgelaufene Einträge werden beim nächsten Speichern gelöscht. Ist der Speicher gesperrt oder kaputt, lädt die Seite einfach neu von der API.

Anfragen an `api.artic.edu` im Network-Tab (Filter „api.artic“):

| Aktion | vorher | nachher |
|---|---|---|
| „monet“ zügig ins Suchfeld tippen | 5 (eine pro Buchstabe) | 1 |
| Startseite innerhalb einer Minute neu laden | 1 | 0 |
| Auf der Startseite von Seite 1 bis Seite 4 blättern | 4 | 1 |
| Dieselbe Suche zweimal hintereinander | 2 | 1 |

### Teil C: Verständnisfragen

**Warum wirft `fetch` bei einem 404 keinen Fehler?** Für `fetch` ist die Anfrage gelungen, sobald überhaupt eine Antwort vom Server zurückkommt, auch wenn diese Antwort „gibt es nicht“ lautet. Fehler wirft `fetch` nur, wenn gar keine Antwort ankommt, etwa offline oder bei einem CORS-Verbot. Deshalb prüfen wir nach jeder Anfrage `res.ok` (wahr bei Status 200 bis 299) und werfen selbst einen Fehler mit verständlicher Meldung, den das `catch` in `js/galerie.js` als Fehlerzustand anzeigt.

**CORS in drei Sätzen:** Der Browser blockiert, dass ein Skript von unserer Domain die Antwort einer fremden Domain liest, solange diese das nicht ausdrücklich erlaubt. Das schützt die Nutzer: Eine fremde Seite soll nicht mit deren Cookies und Anmeldungen heimlich Daten von anderen Diensten abrufen können. Helfen kann nur der angefragte Server, indem er einen Header wie `Access-Control-Allow-Origin: *` schickt (wie das Art Institute), oder ein eigener Server, der die Anfrage weiterreicht.

**Was heißt asynchron?** Der Browser schickt die Anfrage los und macht sofort weiter; die Antwort wird später verarbeitet, wenn sie da ist (`await` wartet nur innerhalb der eigenen Funktion). Wäre `fetch` synchron, stünde die ganze Seite still, bis die Antwort da ist: keine Klicks, kein Scrollen, kein „Lade …“, und bei einem langsamen Netz wirkte die Seite minutenlang eingefroren.

### A4: Eine Bibliothek bewerten – DOMPurify

Die Werkseite zeigt den Beschreibungstext des Museums (`description`). Er kommt als HTML aus der API, mit Absätzen, Kursivschrift und Links. Setzt man fremdes HTML ungeprüft mit `innerHTML` ein, könnte ein eingeschleustes `<script>` oder `onerror="…"` auf unserer Seite laufen (XSS). Nur `textContent` zu nehmen, wäre sicher, zeigt aber die Tags als Text an. Geprüft haben wir deshalb **DOMPurify**, das HTML bereinigt und nur harmlose Tags übrig lässt.

| | DOMPurify |
|---|---|
| Downloads pro Woche (npmjs.com) | rund 104 Millionen (19. bis 25. November 2026) |
| Letzte Version | 3.5.0 vom 22. November 2026; wir nutzen 3.4.18 vom 14. November 2026 |
| Größe (bundlephobia.com, 3.4.18) | 28,7 kB, gzip 11,5 kB, keine Abhängigkeiten |
| Lizenz | MPL-2.0 oder Apache-2.0 (frei wählbar) |

**Entscheidung: ja.** Selbst einen HTML-Bereiniger zu schreiben, wäre unsicher; DOMPurify ist dafür der verbreitete Standard, wird laufend gepflegt und hat keine weiteren Abhängigkeiten. Die 11,5 kB lädt nur, wer `app.js` lädt, und sie schützen die einzige Stelle, an der wir HTML aus der API einsetzen (`js/werk.js`). Die brandneue Version 3.5.0 haben wir bewusst noch nicht genommen, sondern die letzte Version davor; der Lockfile hält sie fest.

