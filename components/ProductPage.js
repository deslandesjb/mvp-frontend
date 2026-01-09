/**
 * ============================================================================
 * FICHIER : components/ProductPage.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant affiche la page de détail d'un produit.
 * C'est ici que l'utilisateur peut comparer les prix entre vendeurs.
 * 
 * RÔLE :
 * - Afficher toutes les informations d'un produit
 * - Comparer les prix entre les différents vendeurs
 * - Afficher les avis clients de chaque vendeur
 * - Permettre de naviguer vers la page d'achat (liens externes)
 * 
 * FONCTIONNEMENT :
 * 1. Récupère l'ID du produit depuis l'URL (route dynamique)
 * 2. Fait un appel API pour obtenir les détails
 * 3. Affiche les informations, prix par vendeur, et avis
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Next.js : useRouter pour les routes dynamiques
 * - Lucide React : Icône Star
 * - shadcn/ui : Composants Card, Button
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Next.js Image : Composant optimisé pour les images
 */
import Image from 'next/image';

/**
 * Composants UI shadcn/ui
 */
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';

/**
 * Lucide React : Icône étoile
 */
import {Star} from 'lucide-react';

/**
 * Next.js
 * - Link : Navigation optimisée
 * - useRouter : Accès aux paramètres de route
 */
import Link from 'next/link';
import {useRouter} from 'next/router';

/**
 * React Hooks
 */
import React, {useEffect, useState} from 'react';


// ============================================================================
// 2. COMPOSANT PRODUCTPAGE
// ============================================================================

export default function ProductPage() {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * productInfo : Objet contenant toutes les infos du produit
 * productData : Booléen indiquant si les données sont chargées
 */
const [productInfo, setProductInfo] = useState({});
const [productData, setProductData] = useState(false);


// ─────────────────────────────────────────────────────────────────────────
// 2.2 RÉCUPÉRATION DE L'ID DEPUIS L'URL
// ─────────────────────────────────────────────────────────────────────────
/**
 * useRouter : Hook Next.js pour accéder au router
 * router.query : Objet contenant les paramètres de l'URL
 * 
 * Pour /product/123 → router.query.id = "123"
 */
const router = useRouter();
const {id} = router.query;


// ─────────────────────────────────────────────────────────────────────────
// 2.3 CHARGEMENT DES DONNÉES DU PRODUIT
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Se déclenche quand l'ID change
 * 
 * LOGIQUE :
 * 1. Vérifie que l'ID est valide
 * 2. Fait un appel GET /products/id/:id
 * 3. Stocke les données dans productInfo
 * 4. Met productData à true pour afficher le contenu
 */
useEffect(() => {

// Sécurité : ne pas faire d'appel si ID invalide
if (!id || id === 'undefined') {
return;
}

// Appel API pour récupérer les détails
fetch(`http://localhost:3000/products/id/${id}`)
.then((response) => response.json())
.then((data) => {
if (data.result) {
setProductInfo(data.product);
setProductData(true);
console.log(data.product);
}
});

}, [id]);  // Dépendance : se relance si l'ID change


// ─────────────────────────────────────────────────────────────────────────
// 2.4 FONCTION AFFICHAGE DES ÉTOILES
// ─────────────────────────────────────────────────────────────────────────
/**
 * starsShow : Génère un tableau d'étoiles selon la note
 * 
 * PARAMÈTRE :
 * - note : La note à afficher (sur 5)
 * 
 * RETOUR :
 * - Tableau de composants Star (5 étoiles)
 * 
 * LOGIQUE :
 * Les étoiles sont remplies (fill-orange) si leur index < note - 1
 */
const starsShow = (note) => {
const stars = [];

for (let i = 0; i < 5; i++) {
let starClass = 'stroke-zinc-900';

// Remplit l'étoile si la note est suffisante
if (i < note - 1) {
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

return stars;
};


// ─────────────────────────────────────────────────────────────────────────
// 2.5 GÉNÉRATION DES CARTES D'AVIS
// ─────────────────────────────────────────────────────────────────────────
/**
 * notes : Tableau de cartes affichant les avis clients
 * 
 * STRUCTURE :
 * Pour chaque vendeur → Pour chaque avis → Une carte
 * 
 * AFFICHAGE :
 * - Nom du vendeur (titre)
 * - Contenu de l'avis
 * - Note en étoiles
 */
const notes = productInfo?.sellers?.map((seller, i) => (
<>
{seller.avis.map((avis, j) => (
<Card
key={j}
className="w-full max-w-xl overflow-hidden hover:shadow-lg md:w-[calc(50%-1rem)] xl:w-[calc(33.3%-1rem)]"
>
<CardHeader>
<CardTitle>{seller.seller}</CardTitle>
<CardDescription>{seller.content}</CardDescription>
</CardHeader>
<CardContent>
<p>{avis.content}</p>
<p className="flex">{starsShow(avis.note)}</p>
</CardContent>
</Card>
))}
</>
));


// ─────────────────────────────────────────────────────────────────────────
// 2.6 GÉNÉRATION DES BOUTONS VENDEURS
// ─────────────────────────────────────────────────────────────────────────
/**
 * sellerLinks : Boutons pour acheter chez chaque vendeur
 * 
 * COMPORTEMENT :
 * Chaque bouton ouvre un nouvel onglet vers la page du vendeur
 */
const sellerLinks = productInfo?.sellers?.map((s, i) => {
return (
<Button key={i} className="bg-orange p-0 hover:bg-orangehover">
<Link href={s.url} target="_blank" className="h-full w-full px-4 py-2">
{s.seller}
</Link>
</Button>
);
});


// ─────────────────────────────────────────────────────────────────────────
// 2.7 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<main className="mt-16 flex min-h-screen flex-col items-center justify-center px-8 font-body">

{/* ═══════════════════════════════════════════════════════════════
    SI DONNÉES CHARGÉES : Affiche le produit
    ═══════════════════════════════════════════════════════════════ */}
{productData && (
<>
{/* ─────────────────────────────────────────────────────────
    SECTION PRINCIPALE : Image + Infos
    ───────────────────────────────────────────────────────── */}
<section className="flex flex-col md:flex-row">

{/* Image du produit */}
<div className="md:w-1/2">
{productInfo.picture && (
<Image
className="w-full max-w-2xl"
src={productInfo.picture[0].url}
alt={productInfo.picture[0].title}
width={200}
height={200}
/>
)}
</div>

{/* Informations du produit */}
<div className="flex flex-col justify-center md:w-1/2">

{/* Nom et description */}
<div>
<h1 className="mb-4 text-xl font-bold">{productInfo.name}</h1>
<h2>{productInfo.desc}</h2>
</div>

{/* Prix moyen et note */}
<div>
<p className="mb-2">
Prix moyen: <b>{productInfo.priceMoy}€</b>
</p>
<p className="mb-2 flex">{starsShow(productInfo.noteMoy)}</p>
</div>

{/* Marque et catégorie (liens cliquables) */}
<div>
<h3>
<i>Marque : </i>
<Link 
className="text-orange underline hover:text-orangehover" 
href={`/?brands=${productInfo.brand}`}
>
{productInfo.brand}
</Link>
</h3>
<h3>
<i>Catégorie : </i>
<Link
className="text-orange underline hover:text-orangehover"
href={`/?categories=${productInfo.categorie}`}
>
{productInfo.categorie}
</Link>
</h3>
</div>

{/* Boutons d'achat par vendeur */}
<div>
<h2 className="mb-2 mt-4 text-lg underline">Ou acheter</h2>
<div className="flex gap-4">{sellerLinks}</div>
</div>

</div>
</section>


{/* ─────────────────────────────────────────────────────────
    SECTION AVIS
    ───────────────────────────────────────────────────────── */}
<section>
<h2 className="mb-16 mt-4 text-3xl">Voir les avis</h2>
</section>

{/* Grille des avis */}
<section className="mb-16 flex flex-wrap justify-center gap-4 md:justify-between">
{notes}
</section>
</>
)}


{/* ═══════════════════════════════════════════════════════════════
    SI PAS DE DONNÉES : Message d'erreur
    ═══════════════════════════════════════════════════════════════ */}
{!productData && (
<section>
<h1>No data found</h1>
</section>
)}

</main>
);
}
