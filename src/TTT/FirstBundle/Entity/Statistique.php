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
    
    

    public function __construct()
    {
        parent::__construct();
    }
}