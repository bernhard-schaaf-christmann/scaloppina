var quiz_data = {
  "start": {
	"password" : "5,3",
    "password_hash": "HAuz", // TODO mehrere Password hashes für die Varianten
    "text": "Schachttiefste in m NN",
    "image": "empty.png",
	"next" : "waypoint_a"
  },
  "waypoint_a": {
	"password": "gwww",
    "password_hash": "fKSLYw==",
    "text": "Folge der Spur von VSE-Net. An der ersten Einmündung nach dem Tor, das sich von Geisterhand zu bewegen scheint, befinden sich links vier technische Schilder. Was kennzeichnen die Schilder? Von links nach rechts, nenne nur die die vier Anfangsbuchstaben (kleinschreibung).",
    "image": "empty.png",
	"next" : "waypoint_b"
  },
  "waypoint_b": {
	"password" : "42",
    "password_hash": "Ofg=",
    "text": "Hinweis für nächsten Wegpunkt",
    "image": "Zeichnung3.svg",
	"next" : "finish"
  },
  "finish": {
	"password" : "43",
    "password_hash": "OXw=",
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

