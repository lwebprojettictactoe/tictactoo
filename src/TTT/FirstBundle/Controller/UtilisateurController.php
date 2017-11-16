<?php

namespace TTT\FirstBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class UtilisateurController extends Controller
{
    public function statistiqueAction()
    {
        $em=$this->getDoctrine()->getManager();
        $repo=$em->getRepository(\TTT\FirstBundle\Entity\Statistique::class);
        $user=$this->getUser();
        $stat=$repo->findOneBy(array('id_utilisateur' => $user));
        $nbTot=$stat->getPointsTotal();
        $nbParties = $stat->getNbPartiesTotal();
        return $this->render('TTTFirstBundle:Utilisateur:statistique.html.twig', array('Stat'=>$stat, 'PointsTotal' => $nbTot, 'NbParties' => $nbParties));
    }
}
