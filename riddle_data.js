var quiz_data = {
	"start": {
		"password" : "Empathie",
		"password_hash": "QPs0ycKwE80=",
		"password_hash_array": [ "QPs0ycKwE80=", "8Amku7BcM+U=" ],
		"text": "Rätsel 1",
		"title" : "Rätsel 1", // TODO
		"image": "dia-puzzle.png",
		"next" : "restodia"
	},
	"restodia": {
		"password": "Streichholzschachtel",
		"password_hash": "6qE5Z/T6cc1danURmLoXtqUfSuI=",
		"password_hash_array": [ "6qE5Z/T6cc1danURmLoXtqUfSuI=", "9CfIoddfKH9jKMlxbJUlZNTmRK4=" ],
		"text": "",
		"image": "RestoDia.png",
		"next" : "papierstapel"
	},
	"papierstapel": {
		"password" : "Astloch",
		"password_hash": "Cv78fkSpEA==",
		"password_hash_array": [ "Cv78fkSpEA==", "CwLih376iA==", "Cv5kF4XoXw=="],
		"text": "Bei der achten Iteration seines Rätsels passierte es: Ein primitiver Affe und sein Sohn kamen und sprangen wie wahnsinnig auf seine Notizen. Ordentliche Papierstapel wurden von den Primaten rücksichtslos in tausend Richtungen geschleudert. Manche landeten sogar in der Prims! Wie sollte er trotzdem rechtzeitig fertig werden? Als Klassenprimus in Mathe hatte er schließlich einen prima Ruf zu verlieren. Träge sortierte Leopold sein Rätsel über Anfangsbuchstaben wieder ordentlich. Dann der Geistesblitz! Charmanterweise ist hier ein prima Hinweis sechsmal versteckt.",
		"image": "",
		"next" : "laby"
	},
	"laby": {
		"password" : "teil",
		"password_hash": "+pik6Q==",
		"password_hash_array": [ "+pik6Q==", "9Rc0iA=="],
		"text": "Hinweis: Die Lösung hat vier Buchstaben.",
		"image": "laby3.png",
		"next" : "done"
	},
	"done": {
		"password" : "",
		"password_hash": "0815",
		"text": "Am Ziel",
		"image": "",
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
