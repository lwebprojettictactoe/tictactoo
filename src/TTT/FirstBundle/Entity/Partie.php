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
     * @ORM\JoinColumn (name ="id_utilisateur1", referencedColumnName ="id")
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
     * @var integer 
     * @ORM\Column(type="integer")
     */
    protected $score_Joueur1;
    
    /**
     * @var integer 
     * @ORM\Column(type="integer")
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
}