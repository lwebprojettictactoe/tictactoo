/*Initialisation des différents élements JQuery*/
$("#toutes").click(function () { typeGame("Toutes"); recuperationPartie("Toutes"); }); // The value of the selected option
$("#attente").click(function () { typeGame("En attente"); recuperationPartie("En attente"); }); // The value of the selected option
$("#cours").click(function () { typeGame("En cours"); recuperationPartie("En cours") }); // The value of the selected option


$("#reload").click(function ()
{
	typeGame("Toutes");
	recuperationPartie("Toutes");
});

$("#dropdown-type-game").dropdown();

$(document).ready(function() {
	$('select').material_select();
});
$('select').material_select('destroy');

function typeGame(type) {
	if(document.getElementById("value-type")){
		document.getElementById("value-type").innerHTML = type;
	}
	else{
		let valueType = document.createElement("strong");
		valueType.setAttribute("id", "value-type");
	}
}

function showForm(){
	if(!$("#form-ajout").hasClass("scale-out")){
		document.getElementById("add-partie").innerHTML = "<i class=material-icons>add</i>";
		$("#form-ajout").addClass("scale-out");
	}
	else{
		document.getElementById("add-partie").innerHTML = "<i class=material-icons>remove</i>";

		$("#form-ajout").removeClass("scale-out");
	}
}

function addIndeter(){
	$("#listGame").append("<div id=inder class=\"preloader-wrapper big active\">" +
		"<div class=\"spinner-layer spinner-blue-only\">" +
		"<div class=\"circle-clipper left\">" +
		"<div class=\"circle\"></div>" +
		"</div>" +
		"<div class=\"gap-patch\">" +
		"<div class=\"circle\"></div>" +
		"</div>" +
		"<div class=\"circle-clipper right\">" +
		"<div class=\"circle\"></div>" +
		"</div>" +
		"</div>" +
		"</div>");
}

function removeIndeter() {
	$("#inder").remove();
}
function init() {
	typeGame("Toutes");
	recuperationPartie("Toutes");
}