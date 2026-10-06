# ArtScout

ArtScout ist eine Web-App zum Entdecken von Kunstwerken aus der Sammlung des Art Institute of Chicago. Sie richtet sich an Kunstinteressierte, Studierende und alle, die ohne Museumsbesuch durch eine große Sammlung stöbern und sich eigene Favoriten zusammenstellen möchten.

**Live:** https://<euer-name>.github.io/<repo>/
**Team:** Lisa Westenhöfer, Hasan Can, Leo Marker

## Was die App kann

- Kunstwerke nach Titel, Künstler oder Stichwort suchen und die Ergebnisse als responsive Bildergalerie anzeigen
- Ergebnisse nach Epoche bzw. Entstehungszeit filtern und seitenweise durchblättern (Pagination)
- Eine Detailansicht mit großem Bild, Künstler, Datierung, Technik und Maßen öffnen
- Kunstwerke als Favoriten speichern; die Favoritenliste bleibt im Browser (localStorage) erhalten

## Datenquelle

Die App nutzt die öffentliche **Art Institute of Chicago API**, die ohne Registrierung und ohne API-Key zugänglich ist. Abgefragt wird der Endpunkt `/api/v1/artworks/search` mit den Feldern `id`, `title`, `artist_display`, `date_display`, `medium_display`, `dimensions` und `image_id`. Die Bilder werden über den IIIF-Bildserver des Museums geladen; die Bild-URL wird aus `config.iiif_url` und der `image_id` zusammengesetzt. Werke ohne `image_id` werden in der Galerie ausgeblendet.

Die Daten werden bei jeder Suche live von der API geladen, es gibt keine eigene Zwischenspeicherung. Aktualisierungen der Sammlung übernimmt das Museum selbst, sodass die App immer den aktuellen Stand der API zeigt.

Dokumentation: https://api.artic.edu/docs/

## Projektauswahl
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
