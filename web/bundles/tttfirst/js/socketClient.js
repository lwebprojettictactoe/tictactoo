var socket = io.connect('http://localhost:8081');

var typeCase = null;
var peutJouer = false;

const PAGINATION = 7;

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

socket.on("create-room", function () {
	$("#launcher-game").hide();
	swal("En attente d'un adversaire");
});

socket.on("update-case", function (field) {
	peutJouer = !peutJouer;
	$("#begin-game").text('');
	$("#"+field['idCase']).attr("src", field['imgSrc']);
});

socket.on("create-game", function(field){
	$("#launcher-game").hide();
	console.log(document.getElementById("app_username").innerHTML);
	if(field['begin'] === document.getElementById("app_username").innerHTML){
		peutJouer = true;
		typeCase = "/img/case_croix.png";
	}
	else{
		typeCase = "/img/case_rond.png";
	}
	createGame(field);
});

socket.on("error-empty-field", function (champ) {
	swal("Veuillez remplir le champ " + champ);
});

socket.on("error-join-game", function (message) {
	swal(message);
});

socket.on("a-game", function (parties) {
	$("#listGame").text('');
	$("#pagination-partie").remove();

	if(Object.keys(parties).length === 0){
		$("#listGame").append("<h5 class='center'>Aucune partie trouvée </h5>");
	}
	else if(Object.keys(parties).length < 10){
		console.log(parties);
		for(let partie in parties){
			$("#listGame").append(
				"<tr>" +
				"<td>"+ parties[partie].id + "</td>" +
				"<td>"+ parties[partie].nom + "</td>" +
				"<td>"+ parties[partie].jeu + "</td>" +
				"<td>"+ parties[partie].status + "</td>" +
				"<td>"+ parties[partie].nom_utilisateur1 + "</td>" +
				"<td>"+ (parties[partie].nom_utilisateur2 === null ? '...' : parties[partie].nom_utilisateur2) + "</td>" +
				"</tr>"
			);
		}
	}
	else{
		createPagination(Object.keys(parties).length, parties);
	}
	removeIndeter();
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function deleteCardJoinGame() {
	$("#card-game").remove();
	$("#container-tab").removeClass("col s8").addClass("container");
	$("#section-tab").removeClass("row");
}

async function recuperationPartie(type){
	deleteCardJoinGame();
	$("#listGame").text('');
	$("#pagination-partie").remove();

	addIndeter();
	await sleep(2000);
	socket.emit("fetch-game", type);
}

function createPagination(length, parties) {
	var numberPage = Math.ceil(length / PAGINATION);

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
						"<td>"+ (parties[partie].nom_utilisateur2 === null ? '...' : parties[partie].nom_utilisateur2) + "</td>" +
						"</tr>"
					);
				}
			}
			$("#listGame").delegate('tr', 'click', function () {
				$("#card-game").remove();
				let tabInfo = $(this).children();

				if(tabInfo[3].innerHTML === 'En attente'){
					$("#section-tab").addClass('row').append(
						"<div id='card-game' class='col s4 card'>" +
							"<h2 id='card-type-game' class='header text-cyan'>Partie de " + tabInfo[2].innerHTML + "</h2>" +
							"<div id='card-img' class='card-image'>" +
								"<img id='img-game' src="+srcGame[tabInfo[2].innerHTML]+" height='50%' width='50%'>" +
							"</div>"+
							"<div class='card-content'>" +
								"<p>Joueur dans la partie : " + tabInfo[4].innerHTML + "</p>" +
							"</div>" +
							"<div class='card-action'>" +
								"<a id='join-game' class='text-cyan' href='#'>Rejoindre la partie</a>" +
								"<a id='cancel-join-game' class='text-cyan' href='#'>Annuler</a>" +
							"</div>" +
						"</div>"
					);
					$("#join-game").click(function () {
						socket.emit('join-game', {"idPartie": tabInfo[0].innerHTML, "idJoueur" : $("#form-id-personne").val(), "nom" : $("#form-nom-personne").val()});
					});
					$("#cancel-join-game").click(function () {
						deleteCardJoinGame();
					});
					$("#container-tab").removeClass("container").addClass("col s8");
				}
			});
		})
	}
	$("#pagination-1").click();
}

function searchGame(value) {
	deleteCardJoinGame();
	socket.emit("search-game", value);
}

function createGame(field) {
	$("#game").append(
		"<div class='row'>" +
			"<div class='col s3'>" +
				"<div class='card-panel lighten-5 z-depth-1'>" +
					"<div class ='row valign-wrapper'>" +
						"<div class='col s5 offset-7'>" +
							"<span class='black-text'>"+field['creator']+"</span>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"<h3 id='begin-game' class='header col s6 text-cyan center-align'>"+ field['begin'] + " commence !</h3>" +
			"<div class='col s3'>" +
				"<div class='card-panel lighten-5 z-depth-1'>" +
					"<div class ='row valign-wrapper'>" +
						"<div class='col s12'>" +
							"<span class='black-text' id='adversaire'>"+field['joiner']+"</span>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>" +
		"<div class='row container container-length' id='morpion'>" +
		"</div>"
	);
	creerMorpion(field);
}

function creerMorpion(field) {
	for(let i = 0; i < 3; i++){
		$("#morpion").append(
				"<img id='morpion"+(i*3)+ "' src='/img/Image_blanche.png' class='col s3 hover-morpion' width='100' height='100'/>" +
				"<img src='/img/trait_vertical.png' class='col s1' width='50' height='100'/>" +
				"<img id='morpion"+(i*3+1)+ "' src='/img/Image_blanche.png' class='col s3 hover-morpion' height='100'/>" +
				"<img src='/img/trait_vertical.png' class='col s1' width='50' height='100'/> " +
				"<img id='morpion"+(i*3+2)+ "' src='/img/Image_blanche.png' class='col s3 hover-morpion' width='50' height='100'/>"
		);
		if(i !== 2){
			$("#morpion").append(
				"<img src='/img/trait_horizontal.png' class='center' width='100%' height='50'/>"
			)
		}
	}
	$("img.hover-morpion").hover(function(){
		if(this.src.includes("img/Image_blanche.png")){
			if(typeCase.includes("/img/case_croix.png")){
				$(this).toggleClass("morpion-croix");
			}
			else if(typeCase.includes("/img/case_rond.png")){
				$(this).toggleClass("morpion-rond");
			}
		}
	});
	$("img.hover-morpion").click(function(){
		if(peutJouer){
			socket.emit("update-morpion", {"creator": field['creator'], "imgSrc" : typeCase, "idCase": $(this).attr('id')});
		}
		else{
			swal("Ce n'est pas votre tour");
		}
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
