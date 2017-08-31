var quiz_data = {
  "start": {
    "password-hash": "Start ist ein besonderer Wegpunkt, der keine Verschlüsselung hat",
    "text": "Hinweis für Wegpunkt A",
    "image": "index to coded blob in data_blobs",
	"next" : "waypoint_a"
  },
  "waypoint_a": {
    "password-hash": "Den LFSR mit dem Passwort initialisieren und er spuckt den hier angegebenen Passworthash aus",
    "text": "Hinweis für Wegpunkt B",
    "image": "index to coded blob in data_blobs",
	"next" : "waypoint_b"
  },
  "waypoint_b": {
    "password-hash": "12345",
    "text": "Hinweis für nächsten Wegpunkt",
    "image": "index to coded blob in data_blobs",
	"next" : "finish"
  },
  "finish": {
    "password-hash": "6789A",
    "text": "Am Ziel",
    "image": "index to coded blob in data_blobs",
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

