let noQuestion = 1; 
let noBonnesReponses = 0; 

// Fonction pour enlever l'intro. Quand on clique sur le bouton on enlève l'intro

document.querySelector("button").addEventListener("click", enleverIntro);

function enleverIntro() {
	//On enlève l'écouteur qui gère la fin de l'intro
    document.querySelector("button").removeEventListener("click", enleverIntro);
	
    //On enlève le conteneur de l'intro
    let intro = document.querySelector("#intro");
    intro.parentNode.removeChild(intro);

    //On met le conteneur du quiz visible
    document.querySelector("#quiz").style.display = "block";

    //On affiche la première question
    afficherQuestion(quiz.question1);
}


/**
 * Fonction permettant d'afficher chaque question
 * 
 * @param {object} object Informations sur la question à afficher
 */
function afficherQuestion(question) {

    //On récupère les balises où seront affichées les choix
    let titreQuestion = document.querySelector("#titreQuestion");
    titreQuestion.innerHTML = question.texte;

    let lesChoixDeReponses = document.querySelector("#lesChoix");
    let nbReponses = question.choix.length;
	let unChoix;
	let texteDuChoix;

    for (let i = 0; i < nbReponses; i++) {
		//on crée un élément choix
		unChoix = document.createElement("div");
		//on créé un objet texte pour le choix
		texteDuChoix = document.createTextNode(question.choix[i]);
		//ajout du texte comme enfant
		unChoix.appendChild(texteDuChoix);
		//ajout d'une classe choix
		unChoix.classList.add("choix");
		//si c'est la bonne réponse...
		if(i==question.bonneReponse){
			//affecte la valeur vraie
			unChoix.reponse = true;
		} else {
			//sinon affecte la valeur fausse
			unChoix.reponse = false;
		}
       
		//On met un écouteur pour vérifier la réponse choisie
        unChoix.addEventListener("click", verifierReponse);
		lesChoixDeReponses.appendChild(unChoix); 
    }

}

// Fonction permettant de gérer l'affichage de la prochaine question
function gererProchaineQuestion() {
	//vide pied de page
	document.querySelector("footer").innerText="";
	//enlève l'écouteur
	document.querySelector("footer").removeEventListener("click", gererProchaineQuestion);
	
    //On incrémente le no de la prochaine question à afficher
    noQuestion++;

	//dans tous les cas, on enlève les choix
	let aEnlever = document.querySelectorAll(".choix");
	let leurParent = aEnlever[0].parentNode;
		
	while (leurParent.hasChildNodes()){
		leurParent.removeChild(leurParent.firstChild);
	}
		
    //Si il reste une question on l'affiche, sinon c'est la fin
    if (noQuestion <= quiz.nbQuestions) {		
        //On identifie la prochaine question et on l'affiche
        let prochaineQuestion = quiz["question" + noQuestion];
        afficherQuestion(prochaineQuestion);
    } else {
        afficherFinJeu();
    }
}


/**
 * Fonction permettant de vérifier la réponse choisie et de gérer la suite
 * 
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
function verifierReponse(event) {
	//si c'est la bonne réponse...
	if(event.target.reponse){
		//ajoute 1 au compteur de bonnes réponses
		noBonnesReponses++;
		//affiche visuel d'une bonne réponse
		event.target.classList.add("bonChoix");
	} else {
		//sinon affiche visuel d'une mauvaise réponse
		event.target.classList.add("mauvaisChoix");
	}
	
	//empêche d'autres choix
	let lesChoix = document.querySelectorAll(".choix");
	for (let unChoix of lesChoix) {
		unChoix.removeEventListener("click", verifierReponse);
	}
	
	//affiche message pour continuer
	document.querySelector("section.validation").innerText="Cliquez ici pour continuer";
	//cliquer le texte pour continuer
	document.querySelector("section.validation").addEventListener("click", gererProchaineQuestion);
}





/**
 * Fonction permettant d'afficher l'interface de la fin du jeu
 * 
 */
function afficherFinJeu() {
    //On enlève le quiz de l'affichage et on affiche la fin du jeu
    document.querySelector("#quiz").style.display = "none";
	
	//Message de résultat
	let leResultat;
	
	//on affiche le score
	leResultat= `<p>Vous avez obtenu ${noBonnesReponses} bonne(s) réponse(s) sur ${quiz.nbQuestions}</p>`
	
	//on vérifie le meilleur score et on l'affiche
	//on sauvegarde le meilleur score si nécessaire
	let meilleurScore = localStorage.getItem("leMeilleur");
		
	if (meilleurScore==null){
		leResultat += `<p>C'est un record!!</p>`
		localStorage.setItem("leMeilleur", noBonnesReponses);		
	}
	
	if (meilleurScore < noBonnesReponses){
		leResultat += `<p>C'est un record!!</p>`
		localStorage.setItem("leMeilleur", noBonnesReponses)	
	} else {
		leResultat += `<p>Le meilleur résultat est: ${meilleurScore}</p>`
	}
	
	document.querySelector("#fin").innerHTML = leResultat;
	
	//on offre la possibilité de reprendre le quiz
	let unBouton = document.createElement("button");
	let sonTexte = document.createTextNode("Cliquez ici pour recommencer");
	unBouton.appendChild(sonTexte);
	unBouton.addEventListener("click", pourRecommencer);
	document.querySelector("#fin").appendChild(unBouton);
	
	//et on affiche le tout
    document.querySelector("#fin").style.display = "block";
}


/**
 * Fonction permettant de recommencer
 * 
 */
function pourRecommencer() {
	//Ré-initialisation du score et de la question
	noQuestion = 1; 
	noBonnesReponses = 0; 
	afficherQuestion(quiz.question1);
	
	//vide et cache la fin
	let laFin = document.querySelector("#fin");
	while (laFin.hasChildNodes()){
		laFin.removeChild(laFin.firstChild);
	}
	document.querySelector("#fin").style.display = "none"; 
	
	//montre le quiz
	document.querySelector("#quiz").style.display = "block"; 
}









