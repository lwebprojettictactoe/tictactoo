var http = require('http');
var fs = require('fs');
var param = require('./parameter.js');


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
const sequelize = new Sequelize(param['bdd'], param['user'], param['password'], {
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
	},
	score_joueur1: {
		type: Sequelize.INTEGER
	},
	score_joueur2: {
		type: Sequelize.INTEGER
	}
});

const Statistiques = sequelize.define("statistiques", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		id_utilisateur: {
			type: Sequelize.INTEGER
		},
		nb_victoires: {
			type: Sequelize.INTEGER
		},
		nb_defaites: {
			type: Sequelize.INTEGER
		},
		nb_egalites: {
			type: Sequelize.INTEGER
		},
	}
);

io.sockets.on('connection', function (socket) {

	socket.on('new-game', function (newgame) {
		for (var champs in newgame) {
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
			if((raw.nom_utilisateur1 !== field['nom'] && raw.status === 'En attente') || io.sockets.rooms.indexOf(raw.nom_utilisateur1) >= 0){
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
				io.sockets.in(parties.nom_utilisateur1).emit('create-game', {'idGame': field['idPartie'],'creator' : parties.nom_utilisateur1, 'joiner' : parties.nom_utilisateur2, 'begin' : beginGame});
			}
			else{
				parties.destroy({ force: true });
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
				nom: { [Op.like]: "%"+value+"%" },
				[Op.or]: [{Status: 'En attente'}, {Status: 'En cours'}]

			},
			raw: true,
		}).then(function (parties) {
			socket.emit('a-game', parties);
		});

	});

	socket.on('finish-game', function (field) {
		Parties.findById(field['idGame']).then(parties => {
			if(field['tie']){
				parties.update({
					score_joueur1: 1,
					score_joueur2: 1,
					status: "Finis"
				});
				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur1
					}
				}).then(function (statistique) {
					statistique.update({
						nb_egalites: statistique.nb_egalites + 1
					})
				});
				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur2
					}
				}).then(function (statistique) {
					statistique.update({
						nb_egalites: statistique.nb_egalites + 1
					})
				});
			}
			else if (field['winner'] === parties.nom_utilisateur1) {
				parties.update({
					score_joueur1: 3,
					score_joueur2: 0,
					status: "Finis"
				});

				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur1
					}
				}).then(function (statistique) {
					statistique.update({
						nb_victoires: statistique.nb_victoires + 1
					})
				});
				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur2
					}
				}).then(function (statistique) {
					statistique.update({
						nb_defaites: statistique.nb_defaites + 1
					})
				});
			}
			else{
				parties.update({
					score_joueur1: 0,
					score_joueur2: 3,
					status: "Finis"
				});

				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur1
					}
				}).then(function (statistique) {
					statistique.update({
						nb_defaites: statistique.nb_defaites + 1
					})
				});
				Statistiques.findOne({
					where: {
						id_utilisateur: parties.id_utilisateur2
					}
				}).then(function (statistique) {
					statistique.update({
						nb_victoires: statistique.nb_victoires + 1
					})
				});
			}
		});
		io.sockets.in(field['creator']).emit('destroy-game', field['tie'] ? false : field['winner']);
	})
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

server.listen(param['port']);
