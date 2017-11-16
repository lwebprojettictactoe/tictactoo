<?php

namespace TTT\FirstBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $node_server = $this->container->getParameter('node_server');
        $node_port = $this->container->getParameter('node_server_port');

        return $this->render(
            'TTTFirstBundle:Default:index.html.twig',
            array('server' => $node_server, 'port' => $node_port)
        );
    }
}
