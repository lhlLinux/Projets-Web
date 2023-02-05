
// quelques constantes
const boutonSticker = "Sticker_Search_Button";
const boutonGif = "Gif_Search_Button";
const clefAPI = "inserer votre clef";
const affichage = document.querySelector( ".affichage" ); // c'est ici qu'on affiche les images
const limite = 5;


function reception(content) // fonction charg�e de traiter le contenu re�u
{
	// On traverse le tableau des images pour cr�er une dans notre zone d'affichage
	for (let i = 0; i < limite; i++)
	{
		let image = document.createElement('img')
		image.src = content.data[i].images.downsized.url;
		image.alt = content.data[i].title;
		
		affichage.appendChild(image);
		
		if (affichage.innerHTML.length ==0)
			document.querySelector("p").style.display="block";
		else  
			document.querySelector("p").style.display="none";
	}
}

function afficheMessage(error)
{
	affichage.innerHTML = error;
}

function boutonAppuye(event)
{
	event.preventDefault(); 
	affichage.innerHTML= "";
	let url = "none";
	
	// On choisis le URL en fonction du bouton qui a �t� appuy�
	if (boutonSticker == event.target.id)
		url = `https://api.giphy.com/v1/stickers/search?&api_key=${clefAPI}&limit={limite}&q=`;
	else
		url = `https://api.giphy.com/v1/gifs/search?&api_key=${clefAPI}&limit={limite}&q=`;

	// On ajoute � al cha�ne URL le contenu de la bo�te de recherche
	let str = document.getElementById("Search_Bar").value.trim();
	url = url.concat(str);

	// Pour ensuite envoyer notre requ�te
	fetch(url)
		.then( response => response.json() )
	    .then( content => reception(content) )
	    // Si un message d'erreur est re�u, alors il est affich�
	    .catch( error => afficheMessage(error) );
}


function initialisation() // Fonction qui est rou�e lorsque la page charge
{
	// On ne fait qu'associer un eventListener (le m�me) � chacun des boutons
	document.getElementById("Gif_Search_Button")
			.addEventListener( "click", (event)=>boutonAppuye(event) );
			
	document.getElementById("Sticker_Search_Button")
			.addEventListener( "click", (event)=>boutonAppuye(event) );
}

// C'est ici qu'on initialise le tout
document.addEventListener( "DOMContentLoaded", initialisation );


