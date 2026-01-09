/**
 * ============================================================================
 * FICHIER : components/AllProducts.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant est la page principale qui affiche tous les produits.
 * Il gère deux modes : affichage par défaut et recherche avancée.
 * 
 * RÔLE :
 * - Afficher la liste des produits avec pagination
 * - Gérer la recherche et les filtres via les query params URL
 * - Afficher l'animation du header (FinisherHeader)
 * - Permettre l'ajout aux favoris
 * 
 * MODES DE FONCTIONNEMENT :
 * 1. Mode par défaut : Pagination 12 par 12, tri par note
 * 2. Mode recherche : Filtres via URL (?q=iphone&brands=Apple)
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React Hooks : useState, useEffect, useCallback
 * - Next.js : useSearchParams pour lire les query params
 * - Redux : useSelector pour accéder au token utilisateur
 * - FinisherHeader : Animation de particules dans le header
 * 
 * ============================================================================
 */

'use client'; // Directive Next.js : Ce composant s'exécute côté client


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Composants UI :
 * - Button : Bouton stylisé shadcn/ui
 * - Toaster : Conteneur pour les notifications toast
 */
import {Button} from '@/components/ui/button';
import {Toaster} from '@/components/ui/sonner';

/**
 * Next.js :
 * - Link : Liens optimisés pour le routing
 * - Script : Chargement de scripts externes
 * - useSearchParams : Lecture des query params URL
 */
import Link from 'next/link';
import Script from 'next/script';
import {useSearchParams} from 'next/navigation';

/**
 * React Hooks :
 * - useCallback : Mémorise une fonction pour éviter les re-créations
 * - useEffect : Effets secondaires (fetch, DOM)
 * - useState : État local du composant
 */
import {useCallback, useEffect, useState} from 'react';

/**
 * Redux :
 * - useSelector : Accède à l'état global (token utilisateur)
 */
import {useSelector} from 'react-redux';

/**
 * Composants enfants :
 * - Filter : Panneau de filtres avancés
 * - ProductCard : Carte produit individuelle
 * - SearchComp : Barre de recherche
 */
import Filter from './FilterComp';
import ProductCard from './ProductCard';
import SearchComp from './SearchComp';


// ============================================================================
// 2. COMPOSANT ALLPRODUCTS
// ============================================================================

function AllProducts() {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 LECTURE DES PARAMÈTRES URL (RECHERCHE)
// ─────────────────────────────────────────────────────────────────────────
/**
 * useSearchParams() : Hook Next.js pour lire les query params
 * Exemple : /?q=iphone&brands=Apple
 * searchParams.get('q') → "iphone"
 * searchParams.get('brands') → "Apple"
 */
const searchParams = useSearchParams();


// ─────────────────────────────────────────────────────────────────────────
// 2.2 ÉTATS POUR LA PAGINATION (MODE PAR DÉFAUT)
// ─────────────────────────────────────────────────────────────────────────
/**
 * Système de pagination simple :
 * - startIndex : Index de départ pour le prochain chargement
 * - productsNumber : Index de fin
 * - productFullLength : Nombre total de produits en BDD
 * 
 * Au clic sur "Next", on charge les produits de startIndex à productsNumber
 */
const [startIndex, setStartIndex] = useState(1);
const [productsNumber, setProductsNumber] = useState(12);
const [productFullLength, setProductFullLength] = useState(0);


// ─────────────────────────────────────────────────────────────────────────
// 2.3 ÉTATS POUR LES DONNÉES
// ─────────────────────────────────────────────────────────────────────────
/**
 * productList : Tableau des produits à afficher
 * listsData : Listes de favoris de l'utilisateur (pour le bouton +)
 */
const [productList, setProductList] = useState([]);
const [listsData, setListsData] = useState([]);


// ─────────────────────────────────────────────────────────────────────────
// 2.4 AUTHENTIFICATION
// ─────────────────────────────────────────────────────────────────────────
/**
 * useSelector : Récupère le token depuis le store Redux
 * Si token existe → utilisateur connecté
 */
const token = useSelector((state) => state.user.token);


// ─────────────────────────────────────────────────────────────────────────
// 2.5 MODE ACTIF (RECHERCHE OU PAR DÉFAUT)
// ─────────────────────────────────────────────────────────────────────────
/**
 * isSearchMode :
 * - true : On est en mode recherche (filtres actifs)
 * - false : On est en mode par défaut (pagination simple)
 */
const [isSearchMode, setIsSearchMode] = useState(false);


// ─────────────────────────────────────────────────────────────────────────
// 2.6 ANIMATION HEADER (FINISHER HEADER)
// ─────────────────────────────────────────────────────────────────────────
/**
 * initFinisherHeader : Initialise l'animation de particules
 * 
 * useCallback : Mémorise la fonction pour éviter de la recréer
 * à chaque rendu (optimisation)
 * 
 * FinisherHeader est un script externe chargé via <Script>
 */
const initFinisherHeader = useCallback(() => {

// Vérifie que le script est chargé et disponible
if (typeof window !== 'undefined' && window.FinisherHeader) {

// Cible l'élément qui contiendra l'animation
const headerElement = document.querySelector('.finisher-header');

// Évite de créer plusieurs animations (vérifie si canvas existe déjà)
if (headerElement && !headerElement.querySelector('canvas')) {

// Configuration de l'animation
new window.FinisherHeader({
count: 100,                          // Nombre de particules
size: {
min: 2,
max: 6,
pulse: 0,
},
speed: {
x: {min: 0, max: 0.4},          // Vitesse horizontale
y: {min: 0, max: 0.6},          // Vitesse verticale
},
colors: {
background: '#201e30',           // Fond sombre
particles: ['#ff9a6c', '#ff7849'], // Particules orange
},
blending: 'overlay',
opacity: {center: 1, edge: 0},
shapes: ['c'],                       // Cercles
});
}
}
}, []);


// Déclenche l'animation au montage du composant
useEffect(() => {
initFinisherHeader();
}, [initFinisherHeader]);


// ─────────────────────────────────────────────────────────────────────────
// 2.7 CHARGEMENT PAR DÉFAUT (PAGINATION)
// ─────────────────────────────────────────────────────────────────────────
/**
 * fetchDefaultProducts : Charge les produits par tranche de 12
 * 
 * LOGIQUE :
 * 1. Parcourt les index de startIndex à productsNumber
 * 2. Ajoute chaque produit au tableau
 * 3. Met à jour les index pour la prochaine pagination
 * 
 * NOTE : Cette approche fait N appels API au lieu d'un seul.
 * Une optimisation serait de passer les index au backend.
 */
const fetchDefaultProducts = async () => {
const newProducts = [];

// Charge les produits un par un (pourrait être optimisé)
for (let i = startIndex; i <= productsNumber; i++) {
try {
const response = await fetch(`http://localhost:3000/products`);
const data = await response.json();

if (data.products && data.products[i]) {
setProductFullLength(data.products.length);
newProducts.push(data.products[i]);
}
} catch (error) {
console.error('Erreur fetch default:', error);
}
}

// Ajoute les nouveaux produits à la liste existante (ne remplace pas)
setProductList((prev) => [...prev, ...newProducts]);

// Prépare la prochaine pagination (+12)
setStartIndex(startIndex + 12);
setProductsNumber(productsNumber + 12);
};


// ─────────────────────────────────────────────────────────────────────────
// 2.8 CHARGEMENT DES RÉSULTATS DE RECHERCHE
// ─────────────────────────────────────────────────────────────────────────
/**
 * fetchSearchResults : Récupère les produits selon les filtres
 * 
 * LOGIQUE :
 * 1. Construit un payload à partir des query params URL
 * 2. Envoie une requête POST au backend /products/search
 * 3. Remplace entièrement la liste des produits
 */
const fetchSearchResults = async () => {
try {
// Construction du payload depuis l'URL
const payload = {
search: searchParams.get('q') || '',
categories: searchParams.get('categories')?.split(',') || [],
brands: searchParams.get('brands')?.split(',') || [],
sellers: searchParams.get('sellers')?.split(',') || [],
minPrice: searchParams.get('minPrice'),
maxPrice: searchParams.get('maxPrice'),
sortBy: searchParams.get('sortBy'),
};

const response = await fetch('http://localhost:3000/products/search', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify(payload),
});

const data = await response.json();

// En mode recherche, on REMPLACE la liste (pas d'ajout)
setProductList(data.result ? data.products : []);

} catch (error) {
console.error('Erreur fetch search:', error);
}
};


// ─────────────────────────────────────────────────────────────────────────
// 2.9 BASCULE AUTOMATIQUE ENTRE LES MODES
// ─────────────────────────────────────────────────────────────────────────
/**
 * Ce useEffect détecte automatiquement le mode selon l'URL :
 * - Si des filtres sont présents → mode recherche
 * - Sinon → mode par défaut avec pagination
 * 
 * Se déclenche à chaque changement de searchParams (changement d'URL)
 */
useEffect(() => {

// Vérifie si au moins un filtre est présent dans l'URL
const hasParams =
searchParams.has('q') ||
searchParams.has('categories') ||
searchParams.has('brands') ||
searchParams.has('sellers') ||
searchParams.has('minPrice') ||
searchParams.has('sortBy');

if (hasParams) {
// ─────────────────────────────────────────────────────────────────
// MODE RECHERCHE
// ─────────────────────────────────────────────────────────────────
setIsSearchMode(true);
setProductList([]);        // Vide la liste pour éviter le mélange
fetchSearchResults();

} else {
// ─────────────────────────────────────────────────────────────────
// MODE PAR DÉFAUT
// ─────────────────────────────────────────────────────────────────
setIsSearchMode(false);

// Charge les produits seulement si la liste est vide
if (productList.length === 0) {
fetchDefaultProducts();
}
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchParams]);


// ─────────────────────────────────────────────────────────────────────────
// 2.10 RÉCUPÉRATION DES LISTES UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────
/**
 * allLists : Récupère les listes de favoris de l'utilisateur
 * 
 * Ces listes sont passées aux ProductCard pour permettre
 * l'ajout/retrait de produits aux favoris
 */
const allLists = () => {
token &&
fetch(`http://localhost:3000/lists/${token}`)
.then((response) => response.json())
.then((listsUser) => setListsData(listsUser));
};

// Charge les listes au montage du composant
useEffect(() => {
allLists();
}, []);


// ─────────────────────────────────────────────────────────────────────────
// 2.11 RENDU DES CARTES PRODUITS
// ─────────────────────────────────────────────────────────────────────────
/**
 * Transforme le tableau de produits en composants ProductCard
 * 
 * Props passées à chaque carte :
 * - ...data : Toutes les infos du produit (spread)
 * - listNames : Les listes de l'utilisateur
 * - allLists : Fonction pour rafraîchir les listes
 */
const products = productList.map((data, i) =>
data ? (
<ProductCard 
key={i} 
{...data} 
listNames={listsData.listsUser || []} 
allLists={allLists} 
/>
) : null,
);


// ─────────────────────────────────────────────────────────────────────────
// 2.12 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<main className="-mt-16 min-h-screen bg-slate-50 pb-10 font-body">

{/* ═══════════════════════════════════════════════════════════════
    SECTION HEADER AVEC ANIMATION
    ═══════════════════════════════════════════════════════════════ */}
<section className="finisher-header fixed inset-0 top-0 h-screen"></section>

<div className="relative z-20 min-h-96">
<div className="relative z-10 flex h-full min-h-96 flex-col items-center justify-center p-4 text-center">

{/* Titre dynamique selon le mode */}
<h1 className="font-title text-4xl uppercase tracking-tight text-slate-100">
{isSearchMode ? 'Résultats de la recherche' : 'All Products'}
</h1>

{/* Barre de recherche et filtres */}
<div className="mt-4 flex w-full max-w-3xl justify-center gap-2">
<Filter />
<SearchComp home={true} />
</div>

{/* Bouton "Afficher tout" en mode recherche */}
{isSearchMode && (
<Button
className="mt-4 bg-orange text-zinc-900 hover:bg-orangehover"
onClick={() => (window.location.href = '/')}>
Afficher tout
</Button>
)}
</div>
</div>

{/* ═══════════════════════════════════════════════════════════════
    SECTION LISTE DES PRODUITS
    ═══════════════════════════════════════════════════════════════ */}
<section className="relative z-10 mx-auto max-w-[1600px] px-8 py-8">

{/* Grille de produits */}
<div className="products-container flex flex-wrap justify-center gap-8 md:justify-start">
{products}
</div>

{/* Message si aucun résultat en mode recherche */}
{productList.length === 0 && isSearchMode && (
<div className="py-12 text-center text-gray-500">
Aucun produit ne correspond à vos critères 🫤
</div>
)}

{/* Bouton de pagination (mode par défaut uniquement) */}
{!isSearchMode && productsNumber < productFullLength && (
<div className="my-12 flex justify-center">
<Button
className="bg-orange px-8 py-6 text-zinc-900 shadow-lg hover:bg-orangehover"
onClick={fetchDefaultProducts}>
Next
</Button>
</div>
)}

</section>

{/* ═══════════════════════════════════════════════════════════════
    CHARGEMENT DU SCRIPT FINISHER HEADER
    ═══════════════════════════════════════════════════════════════ */}
<Script 
src="/finisher-header.es5.min.js" 
strategy="lazyOnload" 
onLoad={initFinisherHeader} 
/>

</main>
);
}


// ============================================================================
// 3. EXPORT
// ============================================================================

export default AllProducts;
