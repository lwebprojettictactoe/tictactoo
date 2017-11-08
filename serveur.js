var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {
	fs.readFile('./index.html', 'utf-8', function (error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');

	socket.on('message', function (message) {
		console.log('message du client ' + message);
	});

	socket.on('new-game', function (newgame) {
		for(var champs in newgame){
			console.log(newgame[champs]);
		}
		socket.emit('after-create-game', "Tu peux jouer");
	})
});

// Quand un client se connecte, on le note dans la console


server.listen(8081);