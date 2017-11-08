<?php

namespace TTT\FirstBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UtilisateurController extends Controller
{
    public function statistiqueAction()
    {
        return $this->render('TTTFirstBundle:Utilisateur:statistique.html.twig');
    }
}
