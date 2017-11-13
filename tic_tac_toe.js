function rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur){
    //Horizontal
    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[3].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[5].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[6].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[7].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[8].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[9].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[10].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[11].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[12].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[13].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[14].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[15].innerHTML == tab_joueurs[tourJoueur])
        return true;
    //Vertical
    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[4].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[8].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[12].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[1].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[5].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[9].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[13].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[2].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[6].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[10].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[14].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[7].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[11].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[15].innerHTML == tab_joueurs[tourJoueur])
        return true;
    //Diagonal
    if( tab_pions[0].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[5].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[10].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[15].innerHTML == tab_joueurs[tourJoueur])
        return true;

    if( tab_pions[3].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[6].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[9].innerHTML == tab_joueurs[tourJoueur] &&
        tab_pions[12].innerHTML == tab_joueurs[tourJoueur])
        return true;
}

function estValide(btn){
    return btn.innerHTML.length == 0;
}

function setSymbol(btn, symbole){
    if(symbole == 'X') {
        btn.style.backgroundImage = "url('x65.png')";
        btn.innerHTML = symbole;
    } else {
        btn.style.backgroundImage = "url('o65.png')";
        btn.innerHTML = symbole;
        btn.style.color = "white";
    }

}

function tableauPlein(tab_pions){
    for(var i = 0; i < tab_pions.length; i++){
        if(tab_pions[i].innerHTML.length == 0)
            return false;
    }
    return true;
}

function changerJoueur(tourJoueur){
    var j1 = document.getElementById("J1");
    var j2 = document.getElementById("J2");
    if(tourJoueur == 0){
        j1.style.border = "3px solid green";
        j2.style.border = "0px"
    } else {
        j2.style.border = "3px solid green";
        j1.style.border = "0px"
    }
}
function main(){
    var tab_pions = document.querySelectorAll("#jeu button");
    var tab_joueurs = ['X','O'];
    var tourJoueur = 0;
    var jeuFini = false;

    // parcours du tableau
    for(var i = 0; i < tab_pions.length; i++){
        // ajout d'un event onClick
        tab_pions[i].addEventListener("click", function(){
            //si jeu est fini on sort
            if(jeuFini)
                return;

            //si la case est occupee par un X ou un O
            if(estValide(this)){

                // on marque la case du symbole du joueur
                setSymbol(this, tab_joueurs[tourJoueur]);

                jeuFini = rechercherVainqueur(tab_pions, tab_joueurs, tourJoueur);

                // si un winner

                if(jeuFini){
                    return;
                }

                // match nul

                if(tableauPlein(tab_pions)){
                    return;
                }

                // switch de joueur

                tourJoueur++;
                tourJoueur = tourJoueur%2;
                changerJoueur(tourJoueur);
            }
        })
    }
}
