var quiz_data = {
  "start": {
	"password" : "5,3",
    "password_hash": "HAuz", // TODO mehrere Password hashes für die Varianten
    "text": "Schachttiefste in m NN",
    "image": "Zeichnung.svg",
	"next" : "waypoint_a"
  },
  "waypoint_a": { // 60
	"password": "gwww",
    "password_hash": "fKSLYw==",
    "textHint": "An der ersten Einmündung nach dem Tor, das sich von Geisterhand zu bewegen scheint, befinden sich links vier technische Schilder. Was kennzeichnen die Schilder?", // TODO Vielleicht lieber keine Fragen im Hinweistext.
	"text": "Nenne die vier Anfangsbuchstaben (Kleinschreibung).",
    "image": "",
	"next" : "waypoint_b"
  },
  "waypoint_b": { // 61
	"password" : "EN124", // TODO
    "password_hash": "Ofg=",
	"textHint": "Folge der Spur des Lichtes ein paar Schritte. Vielleicht Siehste Es - (oder au) Net",
    "text": "Die Antwort hat zwei Buchstaben und 3 Ziffern",
    "image": "",
	"next" : "waypoint_c"
  },
  "waypoint_c": { // 62
	"password" : "H", // TODO
    "password_hash": "",
	"textHint": "Zwischen zwei Häusern sitzt ein alter Mann auf der Erde.",
    "text": "Welcher Buchstabe schwebt über dem Mann?",
    "image": "",
	"next" : "waypoint_d"
  },
  "waypoint_d": { // 63
	"password" : "-17", // TODO Dürfen Zeichen verwendet werden?
    "password_hash": "",
	"textHint": "Der moderne Marterpfahl der Straßenverwaltung wartet auf dich an einer Kreuzung.",
    "text": "Löse die Rechenaufgabe fast ganz oben.",
    "image": "",
	"next" : "waypoint_e"
  },
  "waypoint_e": { // 64
	"password" : "27", // TODO
    "password_hash": "",
	"textHint": "Vor einem Haus mit auffallender Farbe steht ein Kasten.", // TODO Zu einfach
    "text": "Bilde die Quersumme der Ziffern.",
    "image": "",
	"next" : "waypoint_g" // Schachtdeckel hatten wir schon
  },
  "waypoint_f": { // 65
	"password" : "",
    "password_hash": "",
	"textHint": "",
    "text": "",
    "image": "",
	"next" : ""
  },
  "waypoint_g": { // 66
	"password" : "A", // TODO
    "password_hash": "",
	"textHint": "Auf das größte Shopping-Center weißt eine Tafel aus purem Marmor hin.",
    "text": "Wie lautet der hexadezimale Tag?",
    "image": "",
	"next" : "waypoint_h"
  },
  "waypoint_h": { // SaarErlebnisland
	"password" : "267", // TODO
    "password_hash": "",
	"textHint": "Überquere den Platz und folge der Fußgängerstraße bis zu einem Erlebnis, das neben einem Helden steht.",
    "text": "Welche Hausnummer hat das erwähnte Jagdhaus?",
    "image": "",
	"next" : "waypoint_i"
  },
  "waypoint_i": { // Heldenstatue
	"password" : "-10",
    "password_hash": "",
	"textHint": "Der Held brütet über zwei Rechenaufgaben.",
    "text": "Addiere die Ergebnisse.",
    "image": "",
	"next" : "waypoint_j"
  },
  // Die restlichen Bilder konnte ich ohne Karte nicht mehr zuordnen.
  "waypoint_j": { // 68
	"password" : "",
    "password_hash": "",
	"textHint": "",
    "text": "",
    "image": "",
	"next" : ""
  },
  "finish": {
	"password" : "42",
    "password_hash": "Ofg=",
    "text": "Am Ziel",
    "image": "Zeichnung4.svg",
	"next" : ""
  }
}

// base64 codierte Bilder in als blobs
var data_blobs = [
	"abcde",
	"fghij",
	"klmno",
	"pqrst",
	"uvwxy",
	"z"
];

