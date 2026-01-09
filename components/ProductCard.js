/**
 * ============================================================================
 * FICHIER : components/ProductCard.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant affiche une carte produit individuelle.
 * Il est utilisé dans la liste des produits et dans les favoris.
 * 
 * RÔLE :
 * - Afficher les informations résumées d'un produit
 * - Permettre l'ajout/retrait aux listes de favoris
 * - Naviguer vers la page détail du produit
 * - Afficher la note en étoiles
 * 
 * PROPS ATTENDUES :
 * - id : ID du produit (pour la navigation et l'ajout aux listes)
 * - name : Nom du produit
 * - desc : Description courte
 * - picture : Tableau d'images [{title, url}]
 * - priceMoy : Prix moyen calculé
 * - noteMoy : Note moyenne (sur 5)
 * - listNames : Listes de l'utilisateur (pour le menu +)
 * - allLists : Fonction pour rafraîchir les listes
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Redux : useSelector pour le token
 * - Lucide React : Icônes (Star, Plus, Minus)
 * - shadcn/ui : Composants Card, Button, DropdownMenu
 * - Sonner : Notifications toast
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Composants UI shadcn/ui
 */
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Icônes Lucide React
 * - Minus : Icône moins (retirer des favoris)
 * - Plus : Icône plus (ajouter aux favoris)
 * - Star : Icône étoile (notation)
 */
import {Minus, Plus, Star} from 'lucide-react';

/**
 * Next.js
 * - Image : Composant optimisé pour les images
 * - Link : Navigation optimisée
 */
import Image from 'next/image';
import Link from 'next/link';

/**
 * Redux : Accès au store global
 */
import {useSelector} from 'react-redux';

/**
 * Composant Inscription : Affiché si non connecté
 */
import Inscription from '../components/Inscription';

/**
 * React Hooks
 */
import {useState} from 'react';

/**
 * Sonner : Notifications toast
 */
import {toast} from 'sonner';


// ============================================================================
// 2. COMPOSANT PRODUCTCARD
// ============================================================================

function ProductCard(props) {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 RÉCUPÉRATION DU TOKEN (AUTHENTIFICATION)
// ─────────────────────────────────────────────────────────────────────────
/**
 * useSelector : Récupère le token depuis le store Redux
 * Si token = null → utilisateur non connecté
 */
const token = useSelector((state) => state.user.token);


// ─────────────────────────────────────────────────────────────────────────
// 2.2 ÉTAT LOCAL
// ─────────────────────────────────────────────────────────────────────────
/**
 * removed : Indique si le produit vient d'être retiré d'une liste
 * Utilisé pour l'affichage de la notification
 */
const [removed, setRemoved] = useState(Boolean);


// ─────────────────────────────────────────────────────────────────────────
// 2.3 FONCTION AJOUTER/RETIRER DES FAVORIS
// ─────────────────────────────────────────────────────────────────────────
/**
 * addToList : Toggle l'ajout/retrait d'un produit dans une liste
 * 
 * PARAMÈTRES :
 * - idProduct : ID du produit
 * - idList : ID de la liste cible
 * - nameProduct : Nom du produit (pour la notification)
 * - nameList : Nom de la liste (pour la notification)
 * 
 * LOGIQUE :
 * 1. Appelle l'API /lists/addToLists (toggle automatique)
 * 2. Rafraîchit les listes via allLists()
 * 3. Affiche une notification
 */
const addToList = (idProduct, idList, nameProduct, nameList) => {
token &&
fetch(`http://localhost:3000/lists/addToLists/${token}/${idProduct}/${idList}`, {
method: 'POST',
headers: {'Content-Type': 'application/json'},
})
.then((response) => response.json())
.then((resultat) => {
console.log(resultat);
console.log(nameProduct);
console.log(nameList);

// Rafraîchit les listes (pour mettre à jour l'icône +/-)
props.allLists();

// Stocke si c'était un retrait ou un ajout
setRemoved(resultat.remove);

// Message dynamique selon l'action
const message = resultat.remove
? `Vous avez enlevé le produit ${nameProduct.slice(0, 10)}...  de la list : ${nameList} `
: `Vous avez ajouté le produit ${nameProduct.slice(0, 10)} à la list :  ${nameList}`;

// Affiche la notification
notif(message);
});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.4 FONCTION NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────
/**
 * notif : Affiche une notification toast
 * 
 * PARAMÈTRE :
 * - message : Le texte à afficher
 * 
 * UTILISE : Sonner (toast)
 */
const notif = (message) => {
toast(message, {
action: {
label: 'Fermer',
},
});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.5 GÉNÉRATION DES ÉTOILES DE NOTATION
// ─────────────────────────────────────────────────────────────────────────
/**
 * Crée un tableau de 5 étoiles
 * Les étoiles sont remplies selon la note moyenne
 * 
 * LOGIQUE :
 * - Si i < noteMoy - 1 → étoile pleine (fill-orange)
 * - Sinon → étoile vide (juste le contour)
 */
const stars = [];
for (let i = 0; i < 5; i++) {
let starClass = ' stroke-zinc-900';

// Remplit l'étoile si la note est suffisante
if (i < props.noteMoy - 1) {
starClass += ' fill-orange';
}

stars.push(
<Star 
key={i} 
strokeWidth={1} 
size={18} 
className={starClass} 
/>
);
}


// ─────────────────────────────────────────────────────────────────────────
// 2.6 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<Card className="min-w-7xl z-10 w-full max-w-xl overflow-hidden bg-white hover:shadow-lg md:w-[calc((100%-2rem)/2)] xl:w-[calc((100%-4rem)/3)]">
<div className="relative flex h-full">

{/* ═══════════════════════════════════════════════════════════════
    DROPDOWN MENU : AJOUTER AUX FAVORIS
    ═══════════════════════════════════════════════════════════════ */}
<DropdownMenu>
{/* Bouton + en haut à droite */}
<DropdownMenuTrigger className="absolute right-0 top-0 z-10 px-4 py-2">
<Plus size={18} />
</DropdownMenuTrigger>

<DropdownMenuContent className="z-10">
<DropdownMenuLabel>My Lists</DropdownMenuLabel>

{/* ─────────────────────────────────────────────────────────
    SI CONNECTÉ : Affiche les listes
    ───────────────────────────────────────────────────────── */}
{token ? (
props.listNames.map((name, i) => {

// Vérifie si le produit est déjà dans cette liste
const productExists = name.products.some(
(product) => product?.id === props.id
);

return (
<div key={i}>
<DropdownMenuSeparator />
<DropdownMenuItem className="justify-between">
{name.name}
<Button
className="bg-transparent hover:bg-transparent"
variant="outline"
onClick={() => {
addToList(props.id, name._id, props.name, name.name);
notif();
}}>
{/* Icône + ou - selon si produit déjà présent */}
{!productExists ? (
<Plus color="darkblue" />
) : (
<Minus color="orange" />
)}
</Button>
</DropdownMenuItem>
</div>
);
})
) : (
/* ─────────────────────────────────────────────────────────
   SI NON CONNECTÉ : Affiche le formulaire d'inscription
   ───────────────────────────────────────────────────────── */
<Inscription card={true} />
)}
</DropdownMenuContent>
</DropdownMenu>


{/* ═══════════════════════════════════════════════════════════════
    LIEN VERS LA PAGE DÉTAIL
    ═══════════════════════════════════════════════════════════════ */}
<Link 
href={'/product/' + props.id} 
className="relative flex h-full flex-col items-center lg:flex-row"
>

{/* ─────────────────────────────────────────────────────────────
    IMAGE DU PRODUIT
    ───────────────────────────────────────────────────────────── */}
<CardContent className="w-1/2 p-0">
<div>
<Image
className="h-full w-full"
src={props.picture[0].url}
alt={props.picture[0].title}
width={200}
height={200}
/>
</div>
</CardContent>


{/* ─────────────────────────────────────────────────────────────
    INFORMATIONS DU PRODUIT
    ───────────────────────────────────────────────────────────── */}
<div className="w-full lg:w-1/2">

{/* Titre et description */}
<CardHeader>
<CardTitle className="text-sm">
{props.name.slice(0, 25) + '...'}
</CardTitle>
<CardDescription>{props.desc}</CardDescription>
</CardHeader>

{/* Note et prix */}
<CardContent>
{/* Étoiles de notation */}
<div className="flex">{stars}</div>

{/* Prix moyen */}
<div className="flex justify-between">
<p className="font-bold">{props.priceMoy}€</p>
</div>
</CardContent>

</div>
</Link>

</div>
</Card>
);
}


// ============================================================================
// 3. EXPORT
// ============================================================================

export default ProductCard;
