/**
 * ============================================================================
 * FICHIER : components/SearchComp.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant fournit une barre de recherche avec prévisualisation.
 * Il affiche les résultats en temps réel pendant la frappe.
 * 
 * RÔLE :
 * - Permettre la recherche de produits
 * - Afficher une prévisualisation des résultats
 * - Rediriger vers la page d'accueil avec la requête
 * 
 * FONCTIONNEMENT :
 * 1. L'utilisateur tape sa recherche
 * 2. Après 300ms de pause, appel API pour prévisualisation
 * 3. Les résultats s'affichent en dropdown
 * 4. Au clic sur un résultat ou soumission → redirection
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Next.js : useRouter pour navigation
 * - Lucide React : Icônes Search et X
 * - shadcn/ui : Input et Button
 * 
 * PROPS :
 * - home : Boolean indiquant si on est sur la page d'accueil
 *          (change le positionnement des résultats)
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
import {Input} from '@/components/ui/input';

/**
 * Lucide React : Icônes
 * - Search : Loupe de recherche
 * - X : Bouton effacer
 */
import {Search, X} from 'lucide-react';

/**
 * Next.js : Hook de navigation
 */
import {useRouter} from 'next/navigation';

/**
 * React Hooks
 */
import {useEffect, useRef, useState} from 'react';


// ============================================================================
// 2. COMPOSANT SEARCHCOMP
// ============================================================================

/**
 * SearchComp : Barre de recherche avec prévisualisation live
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.home - Indique si on est sur la page d'accueil
 * 
 * @returns {JSX.Element} - La barre de recherche avec dropdown
 */
export default function SearchComp(props) {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * query : Le texte saisi par l'utilisateur
 * results : Tableau des résultats de prévisualisation
 */
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);


// ─────────────────────────────────────────────────────────────────────────
// 2.2 RÉFÉRENCES ET HOOKS NEXT.JS
// ─────────────────────────────────────────────────────────────────────────
/**
 * router : Pour la navigation programmatique
 * containerRef : Référence au conteneur (pour détecter le clic extérieur)
 */
const router = useRouter();
const containerRef = useRef(null);


// ─────────────────────────────────────────────────────────────────────────
// 2.3 FONCTION : RÉCUPÉRER LA PRÉVISUALISATION
// ─────────────────────────────────────────────────────────────────────────
/**
 * fetchPreviewData : Appel API pour obtenir les résultats de recherche
 * 
 * APPEL API : POST /products/search
 * 
 * BODY ENVOYÉ :
 * { search: string }
 * 
 * RÉPONSE ATTENDUE :
 * {
 *   result: true,
 *   products: [...] // Tableau de produits correspondants
 * }
 * 
 * COMPORTEMENT :
 * - Utilise async/await pour plus de lisibilité
 * - En cas d'erreur, log dans la console
 */
const fetchPreviewData = async () => {
try {
const response = await fetch('http://localhost:3000/products/search', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({search: query}),
});

if (!response.ok) return;

const data = await response.json();
// Stocke les produits ou un tableau vide
setResults(data.result ? data.products || [] : []);

} catch (error) {
console.error('Erreur fetch preview:', error);
}
};


// ─────────────────────────────────────────────────────────────────────────
// 2.4 EFFET : DEBOUNCE DE LA RECHERCHE
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Déclenche la recherche avec un délai (debounce)
 * 
 * LOGIQUE :
 * 1. Si la query est vide → vide les résultats
 * 2. Sinon → attend 300ms avant de lancer la recherche
 * 3. Le clearTimeout annule si l'utilisateur continue de taper
 * 
 * POURQUOI LE DEBOUNCE ?
 * Évite de faire un appel API à chaque caractère tapé
 * Réduit la charge serveur et améliore les performances
 */
useEffect(() => {

// Si query vide, pas de recherche
if (!query.trim()) {
setResults([]);
return;
}

// Crée un timeout de 300ms
const timeout = setTimeout(() => fetchPreviewData(), 300);

// Cleanup : annule le timeout si query change avant 300ms
return () => clearTimeout(timeout);

}, [query]);  // Dépendance : se relance à chaque changement de query


// ─────────────────────────────────────────────────────────────────────────
// 2.5 FONCTION : SOUMISSION DE LA RECHERCHE
// ─────────────────────────────────────────────────────────────────────────
/**
 * handleSearchSubmit : Redirige vers la page avec la recherche
 * 
 * PARAMÈTRE :
 * - e : L'événement de soumission du formulaire
 * 
 * COMPORTEMENT :
 * 1. Empêche le rechargement de page (preventDefault)
 * 2. Redirige vers /?q=recherche
 * 3. Vide les résultats de prévisualisation
 * 
 * encodeURIComponent : Encode les caractères spéciaux pour l'URL
 */
const handleSearchSubmit = (e) => {
if (e) e.preventDefault();

// Redirection avec la query en paramètre
router.push(`/?q=${encodeURIComponent(query)}`);

// Ferme la dropdown de prévisualisation
setResults([]);
};


// ─────────────────────────────────────────────────────────────────────────
// 2.6 EFFET : FERMER AU CLIC EXTÉRIEUR
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Détecte les clics en dehors du composant
 * 
 * LOGIQUE :
 * 1. Ajoute un listener sur mousedown
 * 2. Si le clic est en dehors du containerRef → ferme les résultats
 * 3. Nettoie le listener au démontage
 * 
 * containerRef.current?.contains(e.target)
 * → Vérifie si l'élément cliqué est un enfant du container
 */
useEffect(() => {

const handler = (e) => {
if (!containerRef.current?.contains(e.target)) {
setResults([]);
}
};

// Ajoute l'écouteur
document.addEventListener('mousedown', handler);

// Cleanup : retire l'écouteur au démontage
return () => document.removeEventListener('mousedown', handler);

}, []);


// ─────────────────────────────────────────────────────────────────────────
// 2.7 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<div className="relative mx-auto w-full font-sans" ref={containerRef}>

{/* ═══════════════════════════════════════════════════════════════
    FORMULAIRE DE RECHERCHE
    ═══════════════════════════════════════════════════════════════ */}
<form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2">

{/* Conteneur de l'input avec icône */}
<div className="relative flex-1">

{/* Icône loupe à gauche */}
<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

{/* Champ de saisie */}
<Input
className="w-full pl-9"
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Rechercher..."
/>

{/* Bouton X pour effacer (visible si query non vide) */}
{query && (
<button
type="button"
onClick={() => setQuery('')}
className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
>
<X className="h-4 w-4" />
</button>
)}
</div>

{/* Bouton de soumission */}
<Button type="submit" className="shrink-0 bg-orange text-zinc-900 hover:bg-orangehover">
<Search className="h-4 w-4" />
</Button>
</form>


{/* ═══════════════════════════════════════════════════════════════
    DROPDOWN DE PRÉVISUALISATION
    ═══════════════════════════════════════════════════════════════ */}
{results.length > 0 && (
<div
className={`z-50 mt-2 max-h-[60vh] w-full overflow-hidden overflow-y-auto rounded-lg border bg-background shadow-xl ${
props.home ? ' absolute' : ''
}`}
>
<ul>
{/* ─────────────────────────────────────────────────────
    LISTE DES RÉSULTATS
    ───────────────────────────────────────────────────── */}
{results.map((item, index) => (
<li
key={index}
className="flex cursor-pointer gap-4 border-b p-4 transition-colors last:border-0 hover:bg-muted/50"
onClick={() => router.push(`/?q=${encodeURIComponent(item.name)}`)}
>
{/* Image du produit */}
<div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white">
<img
src={Array.isArray(item.picture) ? item.picture[0]?.url : item.picture || '/placeholder.png'}
alt={item.name}
className="h-full w-full object-contain"
onError={(e) => (e.target.src = '/placeholder.png')}
/>
</div>

{/* Informations du produit */}
<div className="flex min-w-0 flex-1 flex-col justify-between">
<div>
{/* Nom */}
<p className="truncate text-sm font-semibold">{item.name}</p>
{/* Marque et catégorie */}
<p className="truncate text-xs capitalize text-muted-foreground">
{item.brand} • {item.categorie}
</p>
</div>

{/* Prix moyen */}
<div className="mt-1 flex items-center justify-between">
<span className="font-bold text-primary">{item.priceMoy} €</span>
</div>
</div>
</li>
))}
</ul>
</div>
)}

</div>
);
}
