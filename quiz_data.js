var quiz_data = {
  "start": {
	"password" : "5,3",
    "password-hash": "Start ist ein besonderer Wegpunkt, der keine Verschlüsselung hat",
    "text": "Schachttiefste in m NN",
    "image": "Zeichnung.svg",
	"next" : "waypoint_a"
  },
  "waypoint_a": {
	"password": "gwww",
    "password-hash": "Den LFSR mit dem Passwort initialisieren und er spuckt den hier angegebenen Passworthash aus",
    "text": "Folge der Spur von VSE-Net. An der ersten Einmündung nach dem Tor, das sich von Geisterhand zu bewegen scheint, befinden sich links vier technische Schilder. Was kennzeichnen die Schilder? Nenne nur die die vier Anfangsbuchstaben (kleinschreibung).",
    "image": "Zeichnung2.svg",
	"next" : "waypoint_b"
  },
  "waypoint_b": {
	"password" : "42",
    "password-hash": "12345",
    "text": "Hinweis für nächsten Wegpunkt",
    "image": "Zeichnung3.svg",
	"next" : "finish"
  },
  "finish": {
	"password" : "42",
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

