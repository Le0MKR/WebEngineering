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

In VS Code mit Live Server öffnen – oder:

```bash
npx serve .
```

## Technik

Womit gebaut und warum. Eine Zeile pro Entscheidung reicht, aber es soll eine Entscheidung sein, keine Aufzählung von Buzzwords.

## KI-Log

Ehrlich ausfüllen, das zählt zur Bewertung.

| Werkzeug | Wofür benutzt |
| --- | --- |
| z. B. Copilot | z. B. Formular-Validierung erklären lassen |

**Ein Fall, in dem KI geholfen hat:** Was habt ihr gefragt, was kam zurück, was habt ihr geändert?

**Ein Fall, in dem KI falsch lag:** Woran habt ihr es gemerkt, wie habt ihr es gelöst?
