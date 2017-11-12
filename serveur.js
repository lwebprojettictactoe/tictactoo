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
const sequelize = new Sequelize('nomBDD', 'utilisateur', 'motDePasse', {
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
	id_utilisateur1: {
		type: Sequelize.INTEGER
	},
	id_utilisateur2: {
		type: Sequelize.INTEGER
	},
	nom_utilisateur1: {
		type: Sequelize.STRING
	},
	nom_utilisateur2: {
		type: Sequelize.STRING
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
		for (let champs in newgame) {
			if (newgame[champs] === "") {
				socket.emit('error-empty-field', champs);
				return;
			}
		}

		// Table created
		Parties.create({
			nom: newgame["nom"],
			id_utilisateur1: newgame['id_utilisateur1'],
			nom_utilisateur1: newgame['nom_utilisateur'],
			nom_utilisateur2: null,
			jeu: newgame['jeu'],
			status: 'En attente',
			id_utilisateur2: null
		});

		socket.join(newgame['nom_utilisateur']);
		socket.emit('create-room', newgame['nom_utilisateur']);
	});

	socket.on('fetch-game', function (type) {
		if (typeof type === 'undefined') {
			type = 'Toutes;'
		}
		if (type === "Toutes") {
			Parties.findAll({
				where: {
					[Op.or]: [{Status: 'En attente'}, {Status: 'En cours'}]
				},
				raw: true,
			}).then(function (parties) {
				socket.emit('a-game', parties);
			});
		}
		else {
			Parties.findAll({
				where: {
					Status: type
				},
				raw: true,
			}).then(function (parties) {
				socket.emit('a-game', parties);
			});
		}
	});

	socket.on('join-game', function (field) {
		Parties.findById(field['idPartie']).then(parties =>{
			let raw = parties.dataValues;
			if(raw.nom_utilisateur1 !== field['nom'] && raw.status === 'En attente'){
				parties.update({
					id_utilisateur2 : field["idJoueur"],
					nom_utilisateur2: field["nom"],
					status: "En cours"
				});

				socket.join(parties.nom_utilisateur1);

				let beginGame = null;
				if(Math.random() * 100 >= 50){
					beginGame = parties.nom_utilisateur2;
				}
				else{
					beginGame = parties.nom_utilisateur1;
				}
				console.log(beginGame);
				io.sockets.in(parties.nom_utilisateur1).emit('create-game', {'creator' : parties.nom_utilisateur1, 'joiner' : parties.nom_utilisateur2, 'begin' : beginGame});
			}
			else{
				socket.emit('error-join-game', "Une erreur s'est produite");
			}
		});
	});
	socket.on('update-morpion', function (field) {
		io.sockets.in(field['creator']).emit('update-case', field);
	});

	socket.on('search-game', function (value) {

		Parties.findAll({
			where: {
				nom: { [Op.like]: "%"+value+"%" }
			},
			raw: true,
		}).then(function (parties) {
			socket.emit('a-game', parties);
		});

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