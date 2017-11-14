<?php
// src/TTT/FirstBundle/Entity/Statistique.php

namespace TTT\FirstBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="statistiques")
 */
class Statistique
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    
    /**
     *
     * @var int
     * @ORM\OneToOne (targetEntity ="User", inversedBy ="id")
     * @ORM\JoinColumn (name ="id_utilisateur", referencedColumnName ="id")
     */
    protected $id_utilisateur;
    
    /**
     * @var integer 
     * @ORM\Column(type="integer")
     */
    protected $nb_victoires;
    
    /**
     * @var integer 
     * @ORM\Column(type="integer")
     */
    protected $nb_defaites;
    
    /**
     * @var integer 
     * @ORM\Column(type="integer")
     */
    protected $nb_egalites;
    
    

    function __construct() {
      
    }

    
    function getId() {
        return $this->id;
    }

    function getId_utilisateur() {
        return $this->id_utilisateur;
    }

    function getNb_victoires() {
        return $this->nb_victoires;
    }

    function getNb_defaites() {
        return $this->nb_defaites;
    }

    function getNb_egalites() {
        return $this->nb_egalites;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setId_utilisateur($id_utilisateur) {
        $this->id_utilisateur = $id_utilisateur;
    }

    function setNb_victoires($nb_victoires) {
        $this->nb_victoires = $nb_victoires;
    }

    function setNb_defaites($nb_defaites) {
        $this->nb_defaites = $nb_defaites;
    }

    function setNb_egalites($nb_egalites) {
        $this->nb_egalites = $nb_egalites;
    }


}