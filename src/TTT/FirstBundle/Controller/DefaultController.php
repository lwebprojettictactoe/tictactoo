<?php

namespace TTT\FirstBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
	    return $this->render('TTTFirstBundle:Default:index.html.twig');
    }
}
