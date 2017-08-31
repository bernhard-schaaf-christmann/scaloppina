var quiz_data = {
  "start": {
    "password-hash": "Start ist ein besonderer Wegpunkt, der keine Verschlüsselung hat",
    "text": "Hinweis für Wegpunkt A",
    "image": "Zeichnung.svg",
	"next" : "waypoint_a"
  },
  "waypoint_a": {
    "password-hash": "Den LFSR mit dem Passwort initialisieren und er spuckt den hier angegebenen Passworthash aus",
    "text": "Hinweis für Wegpunkt B",
    "image": "Zeichnung2.svg",
	"next" : "waypoint_b"
  },
  "waypoint_b": {
    "password-hash": "12345",
    "text": "Hinweis für nächsten Wegpunkt",
    "image": "Zeichnung3.svg",
	"next" : "finish"
  },
  "finish": {
    "password-hash": "6789A",
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

