/**
 * ============================================================================
 * FICHIER : components/global/Header.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant est le header principal de l'application.
 * Il est présent sur toutes les pages et gère la navigation.
 * 
 * RÔLE :
 * - Afficher le logo et la navigation principale
 * - Gérer la recherche de produits
 * - Afficher les catégories
 * - Gérer l'authentification (connexion/inscription/déconnexion)
 * - S'adapter au responsive (mobile/desktop)
 * 
 * FONCTIONNEMENT :
 * 1. Charge les catégories depuis l'API au montage
 * 2. Affiche différentes vues selon la taille d'écran
 * 3. Anime le header au scroll (changement de couleur)
 * 4. Gère les modales de connexion/inscription
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Next.js : Link, useRouter
 * - Redux : useSelector, useDispatch
 * - GSAP : Animations au scroll
 * - Lucide React : Icônes variées
 * - shadcn/ui : NavigationMenu, Drawer, Accordion, Button
 * - @uidotdev/usehooks : Hook useWindowSize
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Hook personnalisé pour obtenir la taille de la fenêtre
 * Utilisé pour le responsive (mobile vs desktop)
 */
import {useWindowSize} from '@uidotdev/usehooks';

/**
 * Lucide React : Icônes
 * - LogOut : Déconnexion
 * - Menu : Menu hamburger (mobile)
 * - Search : Loupe de recherche
 * - User : Icône utilisateur
 * - X : Fermer
 */
import {LogOut, Menu, Search, User, X} from 'lucide-react';

/**
 * Composants UI shadcn/ui
 */
import {Button} from '@/components/ui/button';

/**
 * Next.js : Composants de navigation
 */
import Link from 'next/link';
import {useRouter} from 'next/router';

/**
 * React Hooks
 */
import {useEffect, useRef, useState} from 'react';

/**
 * Redux : Hooks pour lire et modifier le state
 */
import {useDispatch, useSelector} from 'react-redux';

/**
 * Action Redux : Déconnexion utilisateur
 */
import {logout} from '../../reducer/user';

/**
 * GSAP : Bibliothèque d'animation
 * - useGSAP : Hook React pour GSAP
 * - gsap : Instance principale
 * - ScrollTrigger : Plugin pour animations au scroll
 */
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

// Enregistre le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Composants internes
 */
import Connexion from '../Connexion';
import Inscription from '../Inscription';
import SearchComp from '../SearchComp';

/**
 * Composants UI shadcn/ui pour navigation mobile/desktop
 */
import {Drawer, DrawerClose, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';

import {
NavigationMenu,
NavigationMenuContent,
NavigationMenuItem,
NavigationMenuLink,
NavigationMenuList,
NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';


// ============================================================================
// 2. COMPOSANT HEADER
// ============================================================================

export default function Header() {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * categories : Liste des catégories depuis l'API
 * isSearchOpen : État de la barre de recherche (mobile)
 * isLoginOpen : État de la modal de connexion
 * isInscriptionOpen : État de la modal d'inscription
 */
const [categories, setCategories] = useState([]);
const [isSearchOpen, setIsSearchOpen] = useState(false);
const [isLoginOpen, setIsLoginOpen] = useState(false);
const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);


// ─────────────────────────────────────────────────────────────────────────
// 2.2 HOOKS ET RÉFÉRENCES
// ─────────────────────────────────────────────────────────────────────────
/**
 * size : Taille de la fenêtre (pour responsive)
 * router : Navigation programmatique
 * dispatch : Déclencheur d'actions Redux
 * user : Données utilisateur depuis Redux
 * searchRef : Référence pour détecter clic extérieur
 */
const size = useWindowSize();
const router = useRouter();
const dispatch = useDispatch();
const user = useSelector((state) => state.user);
const searchRef = useRef(null);


// ─────────────────────────────────────────────────────────────────────────
// 2.3 FONCTIONS DE GESTION DES MODALES
// ─────────────────────────────────────────────────────────────────────────
/**
 * openLogin : Ouvre la modal de connexion (ferme inscription)
 * openSignup : Ouvre la modal d'inscription (ferme connexion)
 * 
 * Ces fonctions permettent de basculer entre les deux modales
 */
const openLogin = () => {
setIsInscriptionOpen(false);
setIsLoginOpen(true);
};

const openSignup = () => {
setIsLoginOpen(false);
setIsInscriptionOpen(true);
};


// ─────────────────────────────────────────────────────────────────────────
// 2.4 EFFET : FERMER RECHERCHE AU CLIC EXTÉRIEUR
// ─────────────────────────────────────────────────────────────────────────
/**
 * Détecte les clics en dehors de la barre de recherche
 * pour la fermer automatiquement
 */
useEffect(() => {
const handleClickOutside = (event) => {
if (searchRef.current && !searchRef.current.contains(event.target)) {
setIsSearchOpen(false);
}
};

document.addEventListener('mousedown', handleClickOutside);
return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


// ─────────────────────────────────────────────────────────────────────────
// 2.5 EFFET : CHARGER LES CATÉGORIES
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Récupère les catégories au montage
 * 
 * APPEL API : GET /products/categories
 * 
 * RÉPONSE ATTENDUE :
 * { result: true, categories: ['Casque', 'Portable', ...] }
 */
useEffect(() => {
fetch('http://localhost:3000/products/categories')
.then((response) => response.json())
.then((data) => {
if (data.result) setCategories(data.categories);
})
.catch((error) => console.error('Erreur chargement catégories:', error));
}, []);


// ─────────────────────────────────────────────────────────────────────────
// 2.6 FONCTION : DÉCONNEXION
// ─────────────────────────────────────────────────────────────────────────
/**
 * handleLogout : Déconnecte l'utilisateur
 * 
 * COMPORTEMENT :
 * 1. Dispatch l'action logout() (vide le state user)
 * 2. Redirige vers la page d'accueil
 */
const handleLogout = () => {
dispatch(logout());
router.push('/');
};


// ─────────────────────────────────────────────────────────────────────────
// 2.7 GÉNÉRATION DES LIENS DE CATÉGORIES
// ─────────────────────────────────────────────────────────────────────────
/**
 * catShow : Génère les liens de catégories
 * 
 * LOGIQUE :
 * - Si écran >= 768px (desktop) → NavigationMenuLink
 * - Sinon (mobile) → Simple Link
 * 
 * Chaque lien redirige vers /?categories=NomCategorie
 */
const catShow = categories.map((data, i) => {
if (size.width >= 768) {
// Version Desktop
return (
<NavigationMenuLink key={i} asChild>
<Link href={`/?categories=${data}`}>
<div className="transition-colors first-letter:uppercase hover:text-orange">
{data}
</div>
</Link>
</NavigationMenuLink>
);
} else {
// Version Mobile
return (
<Link key={i} href={`/?categories=${data}`} className="block py-2 first-letter:uppercase">
{data}
</Link>
);
}
});


// ─────────────────────────────────────────────────────────────────────────
// 2.8 ANIMATION GSAP DU HEADER
// ─────────────────────────────────────────────────────────────────────────
/**
 * useGSAP : Hook pour animer le header au scroll
 * 
 * COMPORTEMENT :
 * - Au début : header transparent avec texte orange
 * - Au scroll : header blanc avec texte noir
 * 
 * ScrollTrigger :
 * - start: 50 → Animation commence à 50px de scroll
 * - end: 100 → Animation se termine à 100px
 * - toggleActions: 'play play play reverse' → S'inverse au scroll up
 */
useGSAP(() => {
gsap.fromTo(
'header',
{
backgroundColor: 'rgba(255,255,255, 0)',
color: '#ff7849',
},
{
backgroundColor: 'rgba(255,255,255, 1)',
color: '#000',
scrub: 0.1,
scrollTrigger: {
start: 50,
end: 100,
toggleActions: 'play play play reverse',
},
},
);
});


// ─────────────────────────────────────────────────────────────────────────
// 2.9 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<header className="header sticky top-0 z-50 flex h-16 items-center justify-between bg-transparent px-4 font-title text-orange shadow-lg">

{/* ═══════════════════════════════════════════════════════════════
    MODALES AUTHENTIFICATION (rendues une seule fois, cachées)
    ═══════════════════════════════════════════════════════════════ */}
<div className="hidden">
<Connexion isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} switchToSignup={openSignup} />
<Inscription isOpen={isInscriptionOpen} onOpenChange={setIsInscriptionOpen} switchToLogin={openLogin} />
</div>


{/* ═══════════════════════════════════════════════════════════════
    1. GAUCHE : LOGO
    ═══════════════════════════════════════════════════════════════ */}
<div className="flex items-center md:min-w-60">
<Link
href="/"
className="flex items-center bg-gradient-to-tr from-darkblue to-lightblue bg-clip-text font-title text-xl font-bold text-transparent"
>
{/* SVG du logo AtlasLoot avec dégradé */}
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="atlasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#1e3a8a" />
<stop offset="100%" stopColor="#93c5fd" />
</linearGradient>
</defs>
<g fill="none">
<path
d="m12 8.657l-3.652 8.264c-.118.263-.185.479-.447.479H5.483c-.344 0-.534-.098-.36-.479l5.894-13.53c.118-.226.196-.391.463-.391h1.044c.262 0 .334.165.463.39l5.893 13.526c.17.386-.025.484-.37.484h-2.412c-.262 0-.334-.216-.447-.479l-3.652-8.27z"
fill="url(#atlasGradient)"
/>
<path className="fill-orange" d="m12.005 21l-2.412-4.63h4.741z" fill="url(#atlasGradient)" />
</g>
</svg>
ATLAS<span className="tracking-tight">Loot</span>
</Link>
</div>


{/* ═══════════════════════════════════════════════════════════════
    2. CENTRE : NAVIGATION
    ═══════════════════════════════════════════════════════════════ */}
<div>

{/* ─────────────────────────────────────────────────────────
    NAVIGATION MOBILE (DRAWER)
    ───────────────────────────────────────────────────────── */}
<div className="lg:hidden">
<Drawer direction="right">
{/* Bouton hamburger */}
<DrawerTrigger>
<Menu className="h-6 w-6" />
</DrawerTrigger>

{/* Contenu du drawer */}
<DrawerContent>
<div className="flex h-screen flex-col p-4">
{/* Bouton fermer */}
<DrawerClose className="mb-2 self-end p-2">
<X className="h-6 w-6" />
</DrawerClose>

{/* Navigation mobile */}
<nav className="flex flex-col gap-2 overflow-y-auto">

{/* Recherche Mobile */}
<Accordion type="single" collapsible className="mb-4 w-full">
<div className="relative">
<SearchComp home={false} />
</div>

{/* Accordéon des catégories */}
<AccordionItem value="categories-item" className="border-b">
<AccordionTrigger className="py-3 text-xl font-normal hover:no-underline">
Catégories
</AccordionTrigger>
<AccordionContent className="flex flex-col gap-3 pl-4 text-base">
{catShow}
</AccordionContent>
</AccordionItem>
</Accordion>

{/* Liens principaux */}
<Link href="/" className="py-2 text-xl text-orange">
Tous les produits
</Link>
<Link href="/lists" className="py-2 text-xl">
Favoris
</Link>

{/* Séparateur */}
<div className="my-6 h-px bg-gray-200"></div>

{/* Authentification mobile (non connecté) */}
{!user.token && (
<div className="flex flex-col gap-4">
<Button variant="ghost" onClick={openLogin} className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
Me connecter
</Button>
<Button variant="ghost" onClick={openSignup} className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
Créer un compte
</Button>
</div>
)}

{/* Authentification mobile (connecté) */}
{user.token && (
<div className="mt-2 flex flex-col gap-4">
<div className="flex items-center gap-3 px-1">
<User className="h-5 w-5" />
<span className="text-lg">Bonjour {user.firstname}</span>
</div>
<button
onClick={handleLogout}
className="flex items-center gap-3 px-1 py-2 text-left text-xl font-normal transition-colors hover:text-red-600"
>
<LogOut className="h-5 w-5" />
Déconnexion
</button>
</div>
)}
</nav>
</div>
</DrawerContent>
</Drawer>
</div>


{/* ─────────────────────────────────────────────────────────
    NAVIGATION DESKTOP
    ───────────────────────────────────────────────────────── */}
<NavigationMenu className="hidden lg:flex">
<NavigationMenuList className="flex-wrap gap-4">

{/* Menu Rechercher */}
<NavigationMenuItem>
<NavigationMenuTrigger className="bg-transparent px-3 text-base font-normal transition-colors hover:bg-transparent hover:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
<Link className="flex items-center gap-2" href="/">
<Search className="h-4 w-4" />
Rechercher
</Link>
</NavigationMenuTrigger>
<NavigationMenuContent>
<div className="relative flex w-[400px] flex-col gap-3 p-4">
<p className="mb-1 text-xs font-bold uppercase tracking-wider">Que cherchez-vous ?</p>
<SearchComp home={false} />
</div>
</NavigationMenuContent>
</NavigationMenuItem>

{/* Menu Catégories */}
<NavigationMenuItem>
<NavigationMenuTrigger className="bg-transparent px-3 text-base font-normal transition-colors hover:bg-transparent hover:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
<Link href="/">All categories</Link>
</NavigationMenuTrigger>
<NavigationMenuContent>
<div className="grid w-[400px] gap-3 p-4">
{catShow}
<div className="mt-2 border-t pt-2">
<Link href="/" className="block text-sm font-bold text-orange hover:underline">
Voir tout le catalogue →
</Link>
</div>
</div>
</NavigationMenuContent>
</NavigationMenuItem>

{/* Lien Favoris */}
<NavigationMenuItem>
<NavigationMenuLink asChild>
<Link href="/lists" className="px-3 transition-colors hover:text-orange">
Favoris
</Link>
</NavigationMenuLink>
</NavigationMenuItem>

</NavigationMenuList>
</NavigationMenu>
</div>


{/* ═══════════════════════════════════════════════════════════════
    3. DROITE : AUTHENTIFICATION (DESKTOP)
    ═══════════════════════════════════════════════════════════════ */}
<div className="hidden min-w-60 items-center justify-end gap-6 lg:flex">

{/* Boutons connexion/inscription (non connecté) */}
{!user.token && (
<>
<Button variant="ghost" onClick={openLogin} className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
Me connecter
</Button>
<Button variant="ghost" onClick={openSignup} className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
Créer un compte
</Button>
</>
)}

{/* Profil utilisateur + déconnexion (connecté) */}
{user.token && (
<div className="flex items-center gap-4">
{/* Nom de l'utilisateur */}
<div className="flex flex-col items-end text-sm">
<span className="text-xs">Bonjour</span>
<span className="font-semibold">{user.firstname}</span>
</div>

{/* Séparateur vertical */}
<div className="mx-1 h-8 w-px bg-gray-300"></div>

{/* Bouton déconnexion */}
<button
onClick={handleLogout}
className="group flex items-center gap-2 rounded-full px-3 text-gray-500 transition-colors hover:text-orange"
title="Se déconnecter"
>
<LogOut className="h-5 w-5" />
<span className="text-sm font-medium decoration-orange underline-offset-4 group-hover:underline">
Déconnexion
</span>
</button>
</div>
)}
</div>

</header>
);
}
