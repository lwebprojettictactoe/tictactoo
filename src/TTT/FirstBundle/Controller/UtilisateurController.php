<?php

namespace TTT\FirstBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class UtilisateurController extends Controller{
	public function statistiqueAction($username){
		$em = $this->getDoctrine()->getManager();
		
		$repo = $em->getRepository(\TTT\FirstBundle\Entity\Statistique::class);
                $repoUser = $em->getRepository(\TTT\FirstBundle\Entity\User::class);
		$user = $repoUser->findOneBy(array('username' => $username));
		
		$stat = $repo->findOneBy(array('id_utilisateur' => $user));
		
		$nbTot = $stat->getPointsTotal();
		
		$nbParties = $stat->getNbPartiesTotal();
		
		$repoHistorique = $em->getRepository(\TTT\FirstBundle\Entity\Partie::class);
		$partiesUserUn = $repoHistorique->findBy(array('id_utilisateur1' => $user, 'status' => "Finis"));
		$partiesUserDeux = $repoHistorique->findBy(array('id_utilisateur2' => $user, 'status' => "Finis"));
		
		
		return $this->render('TTTFirstBundle:Utilisateur:statistique.html.twig',
			array('Stat' => $stat,
				'PointsTotal' => $nbTot,
				'NbParties' => $nbParties,
				'partiesUn' => $partiesUserUn,
				'partiesDeux' => $partiesUserDeux));
	}
}
