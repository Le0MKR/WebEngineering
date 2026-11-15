// Kleiner Server für den Bonus von Blatt 5. Start: npm run server
// Nutzt nur Bausteine, die Node.js mitbringt, und dieselben Daten wie die Seite.

import { createServer } from "node:http";
import { themen } from "../js/themen.js";
import { heuteInBerlin, isoDatum, montagDerWoche, sonntagDerWoche, themaIndex } from "../js/woche.js";

const PORT = Number(process.env.PORT) || 3000;

function sendeJson(antwort, status, daten) {
  antwort.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  antwort.end(JSON.stringify(daten, null, 2));
}

const server = createServer((anfrage, antwort) => {
  const url = new URL(anfrage.url, `http://${anfrage.headers.host}`);

  if (anfrage.method !== "GET") {
    sendeJson(antwort, 405, { fehler: "Dieser Server beantwortet nur GET-Anfragen." });
    return;
  }

  // Eigene Route: /api/themen?suche=wasser liefert nur passende Themen.
  if (url.pathname === "/api/themen") {
    const suche = (url.searchParams.get("suche") ?? "").trim().toLowerCase();
    const treffer = themen.filter(
      (thema) =>
        thema.titel.toLowerCase().includes(suche) || thema.einfuehrung.toLowerCase().includes(suche),
    );
    sendeJson(antwort, 200, { suche, anzahl: treffer.length, themen: treffer });
    return;
  }

  if (url.pathname === "/api/themen/aktuell") {
    const heute = heuteInBerlin();
    const montag = montagDerWoche(heute);
    sendeJson(antwort, 200, {
      ...themen[themaIndex(heute, themen.length)],
      von: isoDatum(montag),
      bis: isoDatum(sonntagDerWoche(montag)),
    });
    return;
  }

  sendeJson(antwort, 404, {
    fehler: `Die Route ${url.pathname} gibt es nicht.`,
    routen: ["/api/themen", "/api/themen?suche=…", "/api/themen/aktuell"],
  });
});

server.listen(PORT, () => {
  console.log(`Mini-Server läuft auf http://localhost:${PORT}`);
});
