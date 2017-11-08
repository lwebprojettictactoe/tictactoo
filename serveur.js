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

const Sequelize = require('sequelize');
const sequelize = new Sequelize('projectGame', 'adrien', 'Mecaplast062SQL', {
	host: 'localhost',
	dialect: 'mysql',
	define: {
		timestamps: false
	},
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});
const Op = Sequelize.Op;

const Parties = sequelize.define('parties', {
	jeu: {
		type: Sequelize.STRING
	},
	id_utilisateur1:{
		type: Sequelize.INTEGER
	},
	id_utilisateur2:{
		type: Sequelize.INTEGER
	},
	status: {
		type: Sequelize.STRING
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	nom: {
		type: Sequelize.STRING
	}
});


io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');

	socket.on('message', function (message) {
		console.log('message du client ' + message);
	});

	socket.on('new-game', function (newgame) {
		for(let champs in newgame){
			if(newgame[champs] === ""){
				socket.emit('error-empty-field', champs);
				return;
			}
			console.log(newgame[champs] + " " + champs);
		}

		// Table created
		Parties.create({
				nom: newgame["nom"],
				id_utilisateur1: newgame['id_utilisateur1'],
				jeu: newgame['jeu'],
				status: 'En attente',
				id_utilisateur2: null
		});

		//socket.emit('after-create-game');
	});
	
	socket.on('fetch-game', function (type) {
		if(typeof type === 'undefined'){
			type = 'Toutes;'
		}
		if(type === "Toutes"){
			Parties.findAll({
				where: {
					[Op.or] : [{Status: 'En attente'}, {Status: 'En cours'}]
				},
				raw: true,
			}).then(function(parties){socket.emit('a-game', parties);});
		}
		else{
			Parties.findAll({
				where: {
					Status: type
				},
				raw: true,
			}).then(function(parties){socket.emit('a-game', parties);});
		}
	});
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

server.listen(8081);

