$("#tous").click(function () { typeGame("Toutes"); }); // The value of the selected option
$("#attente").click(function () { typeGame("En attente"); }); // The value of the selected option
$("#cours").click(function () { typeGame("En cours"); }); // The value of the selected option

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

function loadNodeJS(){

}

function init() {
	typeGame("Toutes");
}