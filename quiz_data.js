var quiz_data = {
  "start": {
    "password-hash": "Start ist ein besonderer Wegpunkt, der keine Verschlüsselung hat",
    "text": "Hinweis für Wegpunkt A",
    "image": "base64condiertes Bild",
	"next" : "waypoint_a"
  },
  "waypoint_a": {
    "password-hash": "Den LFSR mit dem Passwort initialisieren und er spuckt den hier angegebenen Passworthash aus",
    "text": "Hinweis für Wegpunkt B",
    "image": "base64condiertes Bild",
	"next" : "waypoint_b"
  },
  "waypoint_b": {
    "password-hash": "12345",
    "text": "Hinweis für nächsten Wegpunkt",
    "image": "base64condiertes Bild",
	"next" : "finish"
  },
  "finish": {
    "password-hash": "6789A",
    "text": "Am Ziel",
    "image": "base64condiertes Bild",
	"next" : "NIL - not in list"
  }
}
