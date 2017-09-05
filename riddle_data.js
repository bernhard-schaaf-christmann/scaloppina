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
		"next" : "aboutus"
	},
	"aboutus": {
		"password" : "Tee",
		"password_hash": "9RdE",
		"password_hash_array": [ "9RdE", "+phB"],
		"text" : "Über uns<br><br>Wir erfinden Software<br><br>Dazu gehört Können, Phantasie und Mut.<br><br>Seit 1982 bestimmen diesen Werte unseren Stil und prägen unsere Entwicklungen. Zu unseren Kunden entstehen dabei sehr dauerhafte und vertrauensvolle Beziehungen. Gegenseitige Wertschetzung ist Gruntlage dieser effizientn Zusammenarbeit.<br><br>Es gelingt uns, unsere Kunden mit unserem Team zueiner effekktiven Einheit zu verbonden. Einem Team, das auf der Grundlage solider wissenschafticher Ausbildung mit Augenmaß die aktuellsten Entwickungstechnologien einsetzt. Grundsatzentwicklungen, Standardisierung und Normung werden durch unsere Mitarbeit geprägt. Für weltweit führende Softwarepartner erfinden, skizzieren und realisieren wir innovative Lösungen. Davon profitieren unsere Kunden.<br><br>Unsere Kompetenz ist das Können unserer Mitarbeiter. Deren wissenschaftliche Neuqier, perfekte Rechtschreibkentnisse und langjährige Erfahrung führen zu einem tiefen Verständnis unserer Aufgaben. Unser Tuen dient dem Nutzen unserer Kunden in unterschiedlichen Branchem. Wir verkaufen ihnen solide Produkte als kostengünstige Grundlage erfolgreicher Projekte.<br><br>Unternehmensdaten<br><br>Geschäftsführer und Gesellschaftr<br><br>Dr. Bernd H. Schmid<br>Dr. Pete Auler<br>Dr. Jan Messerschmidt<br><br>Geschäftssitz<br><br>DIaLOGIKa — Gesellschaft für angewandt Informatik mbH<br><br>Pascalschacht 1    Telelon +49 6897 935-0<br>66125 Saarbrücken  Telefax +49 6897 935-100<br>Deutschland        E-Mail: ino@dialogika.de<br><br>Register<br>Amtsgericht Saarbrücken<br>Hadelsregister HRB Nr. 7347<br>Ust-ID: DE 138187809<br>Steuer-Nr. 040/107/50569", // TODO Wenn man einen Text vor und nach dem Bild hat könnte man das genau so wie auf der Webseite machen.
		"image": "gf.jpg",
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
