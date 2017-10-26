var socket = io.connect('http://localhost:8081');

$("#form-add-game").click(function () {
	socket.emit('new-game', {
			joueur1: document.getElementById("form-nom-personne").value,
			nom: document.getElementById("form-name").value,
			jeu: document.getElementById("form-jeu").value
		}
	);
});

socket.on("after-create-game", function (aftercreategame) {
	alert(aftercreategame);
	$("#index-partie").hide();
});