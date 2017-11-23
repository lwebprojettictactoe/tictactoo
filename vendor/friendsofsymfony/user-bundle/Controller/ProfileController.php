<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FOS\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Controller managing the user profile
 *
 * @author Christophe Coevoet <stof@notk.org>
 */
class ProfileController extends Controller
{
    /**
     * Show the user
     */
    public function showAction()
    {
        $user = $this->getUser();
        
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }
        
        if(file_exists('../web/bundles/tttfirst/photo/'.$user->getId().'.png'))
        {         
            $extension =  '.png';
            return $this->render('FOSUserBundle:Profile:show.html.twig', array(
            'user' => $user, 'extension'=> $extension
        ));
        }
        else
        {
            if(file_exists('../web/bundles/tttfirst/photo/'.$user->getId().'.jpg'))
            {
                $extension= '.jpg';
                return $this->render('FOSUserBundle:Profile:show.html.twig', array(
            'user' => $user, 'extension' => $extension
        ));
            }
            else
            {
                return $this->render('FOSUserBundle:Profile:show.html.twig', array(
            'user' => $user
        ));
            }
            
        }
        
    }

    /**
     * Edit the user
     */
    public function editAction(Request $request)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

            $userManager->updateUser($user);
            if(stristr($_FILES['photo']['name'], '.')== '.png' || stristr($_FILES['photo']['name'], '.')== '.jpg')
            {
                $newName=  stristr($_FILES['photo']['name'], '.');
                $newName= $user->getId().$newName; 
                $dir='../web/bundles/tttfirst/photo/';
                if(file_exists($dir.$user->getId().'.jpg'))
                {
                    unlink($dir.$user->getId().'.jpg');
                }   
                if(file_exists($dir.$user->getId().'.png'))
                {
                    unlink($dir.$user->getId().'.png');
                }   
                move_uploaded_file($_FILES['photo']['tmp_name'], $dir.$_FILES['photo']['name']);                  
                rename($dir.$_FILES['photo']['name'], $dir.$newName);
            }
            else
            {                
                $this->get('session')->getFlashBag()->add('ErreurModifProfil', '');
                return $this->redirectToRoute('fos_user_profile_edit');
            }
            
            
            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_profile_show');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
            $this->get('session')->getFlashBag()->add('SuccesEditProfil', '');
            return $response;
        }

        return $this->render('FOSUserBundle:Profile:edit.html.twig', array(
            'form' => $form->createView(),
        ));
    }
}
