<?php
// src/TTT/FirstBundle/Entity/Partie.php

namespace TTT\FirstBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="parties")
 */
class Partie 
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string ('tictactoe')
     * @ORM\Column(type="string")
     */
    protected $jeu = 'tictactoe';
    
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", inversedBy="id")
     * @ORM\JoinColumn (name ="id_utilisateur1", referencedColumnName ="id", nullable=false)
     */
    protected $id_utilisateur1;
    
     /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", inversedBy="id")
     * @ORM\JoinColumn (name ="id_utilisateur2", referencedColumnName ="id")
     */
    protected $id_utilisateur2;
    
     /**
     * @var string ('En cours','Finis','En attente')
     * @ORM\Column(type="string")
     */
    protected $status = 'En attente';
    
     /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $nom_utilisateur1;
    
    /**
     * @var string
     * @ORM\Column(type="string", nullable=true)
     */
    protected $nom_utilisateur2;
    
    /**
     * @var string
     * @ORM\Column(type="string",length=40)
     */
    protected $nom;
    /**
     * @var integer 
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $score_Joueur1;
    
    /**
     * @var integer 
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $score_Joueur2;

    /**
     * @var \DateTime
     * @ORM\Column(type="date")
     */
    protected $date;

    public function __construct()
    {
        parent::__construct();
    }
    
    function getId() {
        return $this->id;
    }

    function getJeu() {
        return $this->jeu;
    }

    function getId_utilisateur1() {
        return $this->id_utilisateur1;
    }

    function getId_utilisateur2() {
        return $this->id_utilisateur2;
    }

    function getStatus() {
        return $this->status;
    }

    function getNom_utilisateur1() {
        return $this->nom_utilisateur1;
    }

    function getNom_utilisateur2() {
        return $this->nom_utilisateur2;
    }

    function getNom() {
        return $this->nom;
    }

    function getScore_Joueur1() {
        return $this->score_Joueur1;
    }

    function getScore_Joueur2() {
        return $this->score_Joueur2;
    }

    function getDate() {
        return $this->date->format('d-m-Y');
    }

    function setId($id) {
        $this->id = $id;
    }

    function setJeu($jeu) {
        $this->jeu = $jeu;
    }

    function setId_utilisateur1(User $id_utilisateur1) {
        $this->id_utilisateur1 = $id_utilisateur1;
    }

    function setId_utilisateur2(User $id_utilisateur2) {
        $this->id_utilisateur2 = $id_utilisateur2;
    }

    function setStatus($status) {
        $this->status = $status;
    }

    function setNom_utilisateur1($nom_utilisateur1) {
        $this->nom_utilisateur1 = $nom_utilisateur1;
    }

    function setNom_utilisateur2($nom_utilisateur2) {
        $this->nom_utilisateur2 = $nom_utilisateur2;
    }

    function setNom($nom) {
        $this->nom = $nom;
    }

    function setScore_Joueur1($score_Joueur1) {
        $this->score_Joueur1 = $score_Joueur1;
    }

    function setScore_Joueur2($score_Joueur2) {
        $this->score_Joueur2 = $score_Joueur2;
    }

    function setDate(\DateTime $date) {
        $this->date = $date;
    }


}