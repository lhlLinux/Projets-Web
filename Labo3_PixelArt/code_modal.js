
// méthode d'accès abrégée
function element( id ) { return document.getElementById( id ); }

// Ceci sont les éléments du document
const docInfoBulle       = element("MonInfoBulle");
const docGrid            = element("grid")
const docGridSizeBar     = element("sizeBar")
const docGridSizeLine    = element("sizeLine")
const docColorSelector   = element("colorSelector")
const docPalette         = element("palette")
const docBouton          = element("btninfo")
const docBoutonEffacer   = element("boutonEffacer")

// ... et quelques autres variables
const hexValues  = "0123456789ABCDEF";
let   palette = [];
let   globalsize = 0;
let   petitEcran;
let   newInputStyle = " ";
let   oldInputStyle = " ";


//----------------- Gestion de l'info bulle --------------------

// l'élément span qui ferme la bulle
let docSpan = document.getElementsByClassName("fermer")[0];

// quand on clique sur le bouton 'info', la bulle apparaît
docBouton.onclick = function() {
  docInfoBulle.style.display = "block";
}

// quand on clique sur le 'X', la bulle disparaît
docSpan.onclick = function() {
  docInfoBulle.style.display = "none";
}

//---------------- Code principal ------------------

function Initialize() // initialisation préliminaire
{
	if (window.innerWidth < 600) // petit écran
	{
		petitEcran = true;
		newInputStyle = "click";
		oldInputStyle = "mouseenter";
	}
	else  // grand écran
	{
		petitEcran = false;
		newInputStyle = "mouseenter";
		oldInputStyle = "click";	
	}
}

function RandomColor() // génère des couleurs alléatoires sur toute la gamme
{
    let color = "#";
    
    for (let i = 0; i<6; i++)
		color += hexValues[ Math.floor(Math.random() * 16) ];
	
	return color;
}

function PaletteColor() // génère des couleurs alléatoires issues de la palette
{
	return palette[ Math.floor(Math.random() * palette.length) ];
}


function effacerPalette()
{
	// lorsque le bouton "effacer" est appuyé,
	// le tableau des couleurs est vidé et la palette est effacée
	docBoutonEffacer.style.visibility = "hidden";
	docPalette.style.visibility = "hidden";
	docPalette.innerHTML = "";
	colorSource = RandomColor;
	palette = [];
}


function ajouterCouleur(couleur) // ajoute des couleurs à la palette
{
	/*
		Les consignes du projet stipulent que l'usager devrait pouvoir ajouter
		à la palette autant de couleurs qu'il désire. Malgré que le code s'accomode
		déjà à cette indication, on impose tout de même une limite raisonnable
		pour démonter notre aptitude à gérér une telle contrainte.
	    Donc, lorsque le maximum de couleurs a été atteint, on arrête d'en rajouter
	*/
	
	if (palette.length == 70)
		return;
	
	if (palette.length == 0 )
	{
		// dès la première entrée, on rends les éléments visibles
		// et on change la fonction produisant les couleurs aléatoires
		docBoutonEffacer.style.visibility = "visible";
		docPalette.style.visibility = "visible";
		colorSource = PaletteColor;
	}

	// on ajoute la nouvelle couleur au tableau et on crée une nouvelle swatch
	palette.push(couleur);

    const div = document.createElement("div");
    div.style.backgroundColor = couleur;
    div.className = "swatch";
    docPalette.appendChild(div);
}

function changeBGColor(event)
{
	event.target.style.backgroundColor = colorSource();
}

function GenerateGrid( size = 16 )
{
	docGridSizeLine.innerText = `${size} x ${size}`;
	docGrid.style.setProperty('--size', size);
	docGrid.innerHTML = "";
	
	globalsize = size; // on sauvegarde la taille actuelle
	
	//const width = getComputedStyle(docGrid).width
	//if (width == "300px")
		//newinputstyle = "click";
	
	for (let i = 0; i < size*size; i++)
	{
		const div = document.createElement("div");
        div.className = "gridSquare";
        div.addEventListener( newInputStyle, changeBGColor );
        docGrid.appendChild(div);
	}
} // end GenerateGrid()



function changeListener() // Censée de modifier l'eventListener
{
	let divs = docGrid.children; // on obtient la liste des "pixels"
	
	// pour ne modifier que leur eventListener.
	for (let i in divs)
	{
		// l'ancien event listener est enlevé
		divs[i].removeEventListener( oldInputStyle, changeBGColor );
		// pour être remplacé par le nouveau
		divs[i].addEventListener( newInputStyle, changeBGColor );
	}
}


function reportWindowSize() // pour l'eventListener de la fenêtre lors du changement de taille
{
	windowwidth = window.innerWidth;
	
	// on a besoin de l'instant de passage d'une taille à l'autre,
	// non pas seulement du changement de taille
	
	if (petitEcran == false) // on est sur un grand écran
	{
		if (windowwidth < 600) // et on passe en petit format
		{
			petitEcran = true;
			newInputStyle = "click";
			oldInputStyle = "mouseenter";
			changeListener();
		}
	}
	else // on est sur un petit écran
	{
		if (windowwidth >= 600) // et on passe en grand format
		{
			petitEcran = false;
			newInputStyle = "mouseenter";
			oldInputStyle = "click";
			changeListener();
		}
	}
}

//--------------------------- Initialisation de la page --------------------------------

Initialize();

window.onresize = reportWindowSize;

// On ajoute un écouteur d'événements pour être notifiés d'une nouvelle taille
docGridSizeBar.addEventListener( "change", (event)=>GenerateGrid(event.target.value) )

// On ajoute un écouteur d'événements pour être notifiés d'une nouvelle couleur
docColorSelector.addEventListener( "change", (event)=>ajouterCouleur(event.target.value) );

// On ajoute un écouteur d'événements pour effacer la palette lorsque appuyé
docBoutonEffacer.addEventListener( "click", (event)=>effacerPalette() ); 

// colorSource pointe à une fonction initialisée à RandomColor()
let colorSource = RandomColor;

// nécessaire pour repositionner le roulant de la barre lors de la recharge de la page
docGridSizeBar.value = 16;

// On dessine la grille initiale et on initialise la palette
GenerateGrid();
effacerPalette();


