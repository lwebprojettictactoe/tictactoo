var socket = io.connect('http://localhost:8081');

function recuperationPartie(type){
	addIndeter()

	socket.emit("fetch-game", type);
}

$("#form-add-game").click(function () {
	addIndeter();
	socket.emit('new-game', {
			id_utilisateur1: document.getElementById("form-nom-personne").value,
			nom: document.getElementById("form-name").value,
			jeu: document.getElementById("form-jeu").value
		}
	);
	removeIndeter();
});

socket.on("after-create-game", function (aftercreategame) {
	$("#index-partie").hide();
});

socket.on("error-empty-field", function (champ) {
	swal("Veuillez remplir le champ " + champ);
});

socket.on("a-game", function (parties) {
	$("#listGame").text('');

	for(let partie in parties){

		$("#listGame").append(
			"<tr>" +
				"<td>"+ parties[partie].id + "</td>" +
				"<td>"+ parties[partie].nom + "</td>" +
				"<td>"+ parties[partie].jeu + "</td>" +
				"<td>"+ parties[partie].status + "</td>" +
				"<td>"+ parties[partie].id_utilisateur1 + "</td>" +
				"<td>"+ (parties[partie].id_utilisateur2 === null ? '...' : parties[partie].id_utilisateur2) + "</td>" +
			"</tr>"
		);
	}
	removeIndeter();
});
