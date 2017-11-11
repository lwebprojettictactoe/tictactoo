var socket = io.connect('http://localhost:8081');

const PAGINATION = 7;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function recuperationPartie(type){
	$("#listGame").text('');
	$("#pagination-partie").remove();

	addIndeter();
	await sleep(2000);
	socket.emit("fetch-game", type);
}

$("#form-add-game").click(function () {
	addIndeter();
	socket.emit('new-game', {
			id_utilisateur1: document.getElementById("form-id-personne").value,
			nom_utilisateur: document.getElementById("form-nom-personne").value,
			nom: document.getElementById("form-name").value,
			jeu: document.getElementById("form-jeu").value
		}
	);
	socket.emit('create-room', {nom_utilisateur: document.getElementById("form-nom-personne").values});
	removeIndeter();
});

socket.on("create-room", function (name_user) {
	$("#launcher-game").hide();
	createGame(name_user);
});

socket.on("error-empty-field", function (champ) {
	swal("Veuillez remplir le champ " + champ);
});

function createPagination(length, parties) {
	var numberPage = Math.ceil(length / PAGINATION);
	console.log(numberPage);
	$("<ul id='pagination-partie' class='pagination center'></ul>").insertBefore("#add-partie");
	for(let i = 1; i <= numberPage; i++){
		$("#pagination-partie").append(
			"<li class='waves-effect' id='pagination-"+i+"\'><a>"+i+"</a></li>"
		);
		$("#pagination-"+i).click(function(){
			$("#listGame").text('');
			for(var pagination = 1; pagination <= numberPage; pagination++){
				$("#pagination-"+pagination).removeClass("active cyan");
			}
			for(var partie = (i - 1) * PAGINATION; partie < i * PAGINATION; partie++){
				$(this).addClass("active cyan");
				if(partie < Object.keys(parties).length){
					$("#listGame").append(
						"<tr class='cyanHighlight'>" +
						"<td>"+ parties[partie].id + "</td>" +
						"<td>"+ parties[partie].nom + "</td>" +
						"<td>"+ parties[partie].jeu + "</td>" +
						"<td>"+ parties[partie].status + "</td>" +
						"<td>"+ parties[partie].nom_utilisateur1 + "</td>" +
						"<td>"+ (parties[partie].nom_utilisateur2 === null ? '...' : parties[partie].id_utilisateur2) + "</td>" +
						"</tr>"
					);
				}
			}

		})
	}
	$("#pagination-1").click();
}

function searchGame(value){
	socket.emit("search-game", value);
}

socket.on("a-game", function (parties) {
	$("#listGame").text('');
	$("#pagination-partie").remove();

	if(Object.keys(parties).length === 0){
		$("#listGame").append("<h5 class='center'>Aucune partie trouvée </h5>");
	}
	else if(Object.keys(parties).length < 10){
		for(let partie in parties){
			$("#listGame").append(
				"<tr>" +
				"<td>"+ parties[partie].id + "</td>" +
				"<td>"+ parties[partie].nom + "</td>" +
				"<td>"+ parties[partie].jeu + "</td>" +
				"<td>"+ parties[partie].status + "</td>" +
				"<td>"+ parties[partie].nom_utilisateur1 + "</td>" +
				"<td>"+ (parties[partie].nom_utilisateur2 === null ? '...' : parties[partie].id_utilisateur2) + "</td>" +
				"</tr>"
			);
		}
	}
	else{
		createPagination(Object.keys(parties).length, parties);
	}
	removeIndeter();
});

function createGame(name_user) {
	$("#game").append(
		"<div class='row'>" +
			"<div class='col s3 offset-1'>" +
				"<div class='card-panel lighten-5 z-depth-1'>" +
					"<div class ='row valign-wrapper'>" +
						"<div class='col s5 offset-7'>" +
							"<span class='black-text'>"+name_user+"</span>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"<div class='col s3 offset-8'>" +
				"<div class='card-panel lighten-5 z-depth-1'>" +
					"<div class ='row valign-wrapper'>" +
						"<div class='col s12'>" +
							"<span class='black-text' id='adversaire'> En attente d'un adversaire</span>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>" +
		"<div class='row container container-length' id='morpion'>" +
		"</div>"
	);
	creerMorpion();
}

function creerMorpion() {
	for(let i = 0; i < 3; i++){
		$("#morpion").append(
				"<img src='/img/Image_blanche.png' class='col s3 hover-morpion' width='100' height='100'/>" +
				"<img src='/img/trait_vertical.png' class='col s1' width='50' height='100'/>" +
				"<img src='/img/Image_blanche.png' class='col s3 hover-morpion' height='100'/>" +
				"<img src='/img/trait_vertical.png' class='col s1' width='50' height='100'/> " +
				"<img src='/img/Image_blanche.png' class='col s3 hover-morpion' width='50' height='100'/>"
		);
		if(i !== 2){
			$("#morpion").append(
				"<img src='/img/trait_horizontal.png' class='center' width='100%' height='50'/>"
			)
		}
	}
	$("img.hover-morpion").hover(function(){
		if(this.src.includes("img/Image_blanche.png")){
			$(this).toggleClass("morpion-croix")
		}
	});
	$("img.hover-morpion").click(function(){
		$(this).attr("src", "/img/case_croix.png");
	});
	main();
}

function rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur){
	if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[2].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[5].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[6].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[7].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[6].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[7].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[5].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
		return true;

	if( tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
		tab_pions[6].innerHTML == tab_joueurs[tourJoueur])
		return true;
}

function estValide(btn){
	return btn.innerHTML.length == 0;
}

function setSymbol(btn, symbole){
	btn.innerHTML = symbole;
}

function tableauPlein(tab_pions){
	for(var i = 0; i < tab_pions.length; i++){
		if(tab_pions[i].innerHTML.length == 0)
			return false;
	}
	return true;
}

function main(){
	var tab_pions = document.getElementById("morpion").querySelectorAll("#buttons button");
	var tab_joueurs = ['X','O'];
	var tourJoueur = 0;
	var jeuFini = false;
	var afficheur = document.getElementById("statutJeu");

	afficheur.innerHTML = "Le jeu commence.</br>c'est ton tour joueur " + tab_joueurs[tourJoueur];

	// parcours du tableau
	for(var i = 0; i < tab_pions.length; i++){
		// ajout d'un event onClick
		tab_pions[i].addEventListener("click", function(){
			//si jeu est fini on sort
			if(jeuFini)
				return;

			//si la case est occupee par un X ou un O
			if(!estValide(this)){
				afficheur.innerHTML = "deplacement invalide";
			} else {

				// on marque la case du symbole du joueur
				setSymbol(this, tab_joueurs[tourJoueur]);

				jeuFini = rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur);

				// si un winner

				if(jeuFini){
					afficheur.innerHTML = "Joueur " + tab_joueurs[tourJoueur] + " a gagne <a href=index.html>Rejouer</a>";
					return;
				}

				// match nul

				if(tableauPlein(tab_pions)){
					afficheur.innerHTML = "Match nul <a href=index.html>Rejouer</a>";
					return;
				}

				// switch de joueur

				tourJoueur++;
				tourJoueur = tourJoueur%2;

				// joueur suivant
				afficheur.innerHTML = "Joueur " + tab_joueurs[tourJoueur] + " a votre tour";
			}
		})
	}
}
