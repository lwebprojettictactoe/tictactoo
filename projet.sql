CREATE DATABASE IF NOT EXISTS projectGame;
USE projectGame;
-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 26 oct. 2017 à 10:32
-- Version du serveur :  5.7.19
-- Version de PHP :  5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projet`
--

-- --------------------------------------------------------

--
-- Structure de la table `parties`
--

DROP TABLE IF EXISTS `parties`;
CREATE TABLE IF NOT EXISTS `parties` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `Type_Jeu` enum('tictactoo') NOT NULL,
  `Id_utilisateur1` int(10) NOT NULL,
  `Id_utilisateur2` int(10) DEFAULT NULL,
  `Status Enum` enum('En cours','Finis','En attente') NOT NULL,
  `Score_joueur1` int(1) DEFAULT NULL,
  `Score_joueur2` int(1) DEFAULT NULL,
  `Date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (Id_utilisateur1) REFERENCES utilisateur(Id),
  FOREIGN KEY (Id_utilisateur2) REFERENCES utilisateur(Id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `statistiques`
--

DROP TABLE IF EXISTS `statistiques`;
CREATE TABLE IF NOT EXISTS `statistiques` (
  `Id_utilisateur` int(10) NOT NULL,
  `Type_Jeu` enum('tictactoo') NOT NULL,
  `Nombre_vicoire` int(10) DEFAULT NULL,
  `Nombre_defaite` int(10) DEFAULT NULL,
  `Nombre_egalite` int(10) DEFAULT NULL,
	PRIMARY KEY (Id_utilisateur, Type_Jeu),
  FOREIGN KEY (Id_utilisateur) REFERENCES utilisateur(Id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `Login` varchar(20) NOT NULL,
  `Mot_de_passe` varchar(20) NOT NULL,
  `Nom` varchar(20) NOT NULL,
  `Prenom` varchar(20) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Photo` int(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

insert into parties values(default, 'tictactoo', 1, 2, 'En attente', DEFAULT, DEFAULT, DEFAULT);
insert into parties values(default, 'tictactoo', 1, 2, 'En attente', DEFAULT, DEFAULT, DEFAULT);