/*Initialisation des différents élements JQuery*/
$("#tous").click(function () { typeGame("Toutes"); }); // The value of the selected option
$("#attente").click(function () { typeGame("En attente"); }); // The value of the selected option
$("#cours").click(function () { typeGame("En cours"); }); // The value of the selected option
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
		var valueType = document.createElement("strong");
		valueType.setAttribute("id", "value-type");
		document.getElementById("type-game").appendChild(valueType);
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

function init() {
	typeGame("Toutes");
}