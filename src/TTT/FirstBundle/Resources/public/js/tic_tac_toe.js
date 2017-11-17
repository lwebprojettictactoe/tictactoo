function rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur){
    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[2].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[5].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[6].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[7].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[6].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[7].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[5].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[8].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[6].innerHTML == tab_joueurs[tourJoueur])
        return true;
}

function estValide(btn){
    return btn.innerHTML.length == 0;
}

function setSymbol(btn, symbole){
    socket.emit
    btn.innerHTML = symbole;
}

function tableauPlein(tab_pions){
    for(var i = 0; i < tab_pions.length; i++){
        if(tab_pions[i].innerHTML.length == 0)
            return false;
    }
    return true;
}

function main(){
    var tab_pions = document.querySelectorAll("#buttons button");
    var tab_joueurs = ['X','O'];
    var tourJoueur = 0;
    var jeuFini = false;
    var afficheur = document.getElementById("statutJeu");

    afficheur.innerHTML = "Le jeu commence.</br>c'est ton tour joueur " + tab_joueurs[tourJoueur];

    // parcours du tableau
    for(var i = 0; i < tab_pions.length; i++){
        // ajout d'un event onClick
        tab_pions[i].addEventListener("click", function(){
            //si jeu est fini on sort
            if(jeuFini)
                return;

            //si la case est occupee par un X ou un O
            if(!estValide(this)){
                afficheur.innerHTML = "deplacement invalide";
            } else {

                // on marque la case du symbole du joueur
                setSymbol(this, tab_joueurs[tourJoueur]);

                jeuFini = rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur);

                // si un winner

                if(jeuFini){
                    afficheur.innerHTML = "Joueur " + tab_joueurs[tourJoueur] + " a gagne <a href=index.html>Rejouer</a>";
                    return;
                }

                // match nul

                if(tableauPlein(tab_pions)){
                    afficheur.innerHTML = "Match nul <a href=index.html>Rejouer</a>";
                    return;
                }

                // switch de joueur

                tourJoueur++;
                tourJoueur = tourJoueur%2;

                // joueur suivant
                afficheur.innerHTML = "Joueur " + tab_joueurs[tourJoueur] + " a votre tour";
            }
        })
    }
}
