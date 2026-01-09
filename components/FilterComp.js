/**
 * ============================================================================
 * FICHIER : components/FilterComp.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant affiche un panneau de filtres avancés pour les produits.
 * Il permet de filtrer par catégorie, marque, vendeur, prix et tri.
 * 
 * RÔLE :
 * - Fournir une interface de filtrage riche
 * - Construire les paramètres URL pour la recherche
 * - Rediriger vers la page d'accueil avec les filtres appliqués
 * 
 * FONCTIONNEMENT :
 * 1. L'utilisateur ouvre le panneau en cliquant sur "Filtres"
 * 2. Il sélectionne ses critères (catégories, marques, prix, etc.)
 * 3. Au clic sur "Voir les résultats", redirection avec query params
 * 4. La page d'accueil lit les params et fait la recherche
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Next.js : useRouter pour la navigation
 * - Lucide React : Icônes variées
 * - shadcn/ui : Button, Input
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
 * - ArrowDownNarrowWide / ArrowUpNarrowWide : Tri croissant/décroissant
 * - Check : Validation
 * - Minus / Plus : Expand/collapse
 * - SlidersHorizontal : Icône filtres
 * - Star : Note
 */
import {
ArrowDownNarrowWide, 
ArrowUpNarrowWide, 
Check, 
Minus, 
Plus, 
SlidersHorizontal, 
Star
} from 'lucide-react';

/**
 * Next.js : Hook de navigation
 */
import {useRouter} from 'next/navigation';

/**
 * React Hooks
 */
import {useEffect, useRef, useState} from 'react';


// ============================================================================
// 2. CONSTANTES
// ============================================================================

/**
 * ALL_BRANDS : Liste de toutes les marques disponibles
 * 
 * NOTE : Cette liste est codée en dur pour l'instant.
 * Elle pourrait être récupérée depuis l'API à l'avenir.
 */
const ALL_BRANDS = [
'Sony',
'JBL',
'Bose',
'Marshall',
'Avizar',
'Samsung',
'Blackview',
'Générique / Reseller',
'Xiaomi',
'Acer',
'HP',
'Logicom',
'Doogee',
'Lenovo',
'Shokz',
'HyperX',
'SteelSeries',
'Microsoft',
'Greed / Reseller',
'Asus',
'TCL',
'Smart Tech',
'Hisense',
'Proline',
'Thomson',
'Philips',
'Veidoo',
'Archos',
'Apple',
];

/**
 * AVAILABLE_SELLERS : Liste des vendeurs disponibles
 * Correspond aux sources de données du scraping
 */
const AVAILABLE_SELLERS = ['Amazon', 'Darty', 'Fnac'];


// ============================================================================
// 3. COMPOSANT FILTERPANEL
// ============================================================================

export default function FilterPanel() {

// ─────────────────────────────────────────────────────────────────────────
// 3.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * showFilters : Affiche/cache le panneau de filtres
 * expandCats : Affiche toutes les catégories ou seulement 6
 * expandBrands : Affiche toutes les marques ou seulement 6
 * categories : Liste des catégories récupérées depuis l'API
 */
const [showFilters, setShowFilters] = useState(false);
const [expandCats, setExpandCats] = useState(false);
const [expandBrands, setExpandBrands] = useState(false);
const [categories, setCategories] = useState([]);

/**
 * filters : Objet contenant tous les critères de filtrage
 * 
 * STRUCTURE :
 * - categories : Tableau des catégories sélectionnées
 * - brands : Tableau des marques sélectionnées
 * - sellers : Tableau des vendeurs sélectionnés
 * - minPrice : Prix minimum (string vide si non défini)
 * - maxPrice : Prix maximum (string vide si non défini)
 * - sortBy : Critère de tri ('pertinence' par défaut)
 */
const [filters, setFilters] = useState({
categories: [],
brands: [],
sellers: [],
minPrice: '',
maxPrice: '',
sortBy: 'pertinence',
});


// ─────────────────────────────────────────────────────────────────────────
// 3.2 RÉFÉRENCES ET HOOKS NEXT.JS
// ─────────────────────────────────────────────────────────────────────────
/**
 * router : Pour la navigation programmatique
 * filterRef : Référence au conteneur des filtres (pour fermeture au clic extérieur)
 */
const router = useRouter();
const filterRef = useRef(null);


// ─────────────────────────────────────────────────────────────────────────
// 3.3 CHARGEMENT DES CATÉGORIES
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Charge les catégories depuis l'API au montage
 * 
 * APPEL API : GET /products/categories
 * 
 * RÉPONSE ATTENDUE :
 * { result: true, categories: ['Casque', 'Portable', ...] }
 */
useEffect(() => {
fetch('http://localhost:3000/products/categories')
.then((response) => response.json())
.then((data) => data.result && setCategories(data.categories));
}, []);


// ─────────────────────────────────────────────────────────────────────────
// 3.4 HANDLERS D'INTERFACE UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────
/**
 * toggleFilterArray : Ajoute ou retire une valeur d'un filtre tableau
 * 
 * PARAMÈTRES :
 * - field : Le nom du champ ('categories', 'brands', 'sellers')
 * - value : La valeur à ajouter/retirer
 * 
 * LOGIQUE :
 * - Si la valeur existe déjà → on la retire (filter)
 * - Sinon → on l'ajoute (spread + value)
 */
const toggleFilterArray = (field, value) => {
setFilters((prev) => {
const list = prev[field];
if (list.includes(value)) {
// Retire la valeur
return {...prev, [field]: list.filter((item) => item !== value)};
} else {
// Ajoute la valeur
return {...prev, [field]: [...list, value]};
}
});
};

/**
 * handlePriceChange : Met à jour le prix min ou max
 * 
 * PARAMÈTRES :
 * - field : 'minPrice' ou 'maxPrice'
 * - value : La nouvelle valeur
 */
const handlePriceChange = (field, value) => {
setFilters((prev) => ({...prev, [field]: value}));
};

/**
 * handleSortChange : Change le critère de tri
 * 
 * PARAMÈTRE :
 * - value : Le nouveau critère ('pertinence', 'price_asc', 'price_desc', 'stars')
 */
const handleSortChange = (value) => {
setFilters((prev) => ({...prev, sortBy: value}));
};

/**
 * activeCount : Nombre de filtres actifs
 * 
 * Utilisé pour afficher un badge sur le bouton filtres
 * Compte :
 * - Le nombre de catégories
 * - Le nombre de marques
 * - Le nombre de vendeurs
 * - 1 si un prix est défini
 * - 1 si le tri n'est pas "pertinence"
 */
const activeCount =
filters.categories.length +
filters.brands.length +
filters.sellers.length +
(filters.minPrice || filters.maxPrice ? 1 : 0) +
(filters.sortBy !== 'pertinence' ? 1 : 0);


// ─────────────────────────────────────────────────────────────────────────
// 3.5 APPLICATION DES FILTRES
// ─────────────────────────────────────────────────────────────────────────
/**
 * handleApplyFilters : Construit l'URL et redirige
 * 
 * LOGIQUE :
 * 1. Crée un URLSearchParams vide
 * 2. Ajoute chaque filtre actif en paramètre
 * 3. Redirige vers /?params
 * 4. Ferme le panneau de filtres
 * 
 * EXEMPLE D'URL GÉNÉRÉE :
 * /?categories=Casque,Portable&brands=Sony&minPrice=50&sortBy=price_asc
 */
const handleApplyFilters = () => {
const params = new URLSearchParams();

// Ajoute les catégories si présentes
if (filters.categories.length > 0) {
params.append('categories', filters.categories.join(','));
}

// Ajoute les marques si présentes
if (filters.brands.length > 0) {
params.append('brands', filters.brands.join(','));
}

// Ajoute les vendeurs si présents
if (filters.sellers.length > 0) {
params.append('sellers', filters.sellers.join(','));
}

// Ajoute les prix si définis
if (filters.minPrice) {
params.append('minPrice', filters.minPrice);
}
if (filters.maxPrice) {
params.append('maxPrice', filters.maxPrice);
}

// Ajoute le tri si différent de pertinence
if (filters.sortBy !== 'pertinence') {
params.append('sortBy', filters.sortBy);
}

// Redirection avec les paramètres
router.push(`/?${params.toString()}`);

// Ferme le panneau
setShowFilters(false);
};


// ─────────────────────────────────────────────────────────────────────────
// 3.6 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<div className="relative" ref={filterRef}>

{/* ═══════════════════════════════════════════════════════════════
    BOUTON D'OUVERTURE DES FILTRES
    ═══════════════════════════════════════════════════════════════ */}
<Button
type="button"
variant={showFilters ? 'secondary' : 'outline'}
onClick={() => setShowFilters(!showFilters)}
className={`relative shrink-0 border px-3 hover:border-orange hover:bg-orange ${
activeCount > 0 ? 'border-solid border-orangehover bg-orangehover text-primary' : ''
}`}
>
{/* Icône filtres */}
<SlidersHorizontal className="mr-2 h-4 w-4" />

{/* Texte (caché sur mobile) */}
<span className="hidden sm:inline">Filtres</span>

{/* Badge nombre de filtres actifs */}
{activeCount > 0 && (
<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
{activeCount}
</span>
)}
</Button>


{/* ═══════════════════════════════════════════════════════════════
    MODAL PANNEAU DE FILTRES
    ═══════════════════════════════════════════════════════════════ */}
{showFilters && (
<div className="absolute left-0 top-full z-50 mt-2 flex max-h-[60vh] w-[calc(100vw-2rem)] max-w-[400px] flex-col rounded-xl border bg-popover text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 sm:max-h-[500px] sm:w-[400px]">

{/* Contenu scrollable */}
<div className="flex-1 space-y-6 overflow-y-auto p-5">

{/* ─────────────────────────────────────────────────────
    SECTION TRI
    ───────────────────────────────────────────────────── */}
<div>
<h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
Trier par
</h4>
<div className="flex flex-wrap gap-2">
{/* Options de tri avec leurs icônes */}
{[
{label: 'Pertinence', val: 'pertinence', icon: null},
{label: '- Cher', val: 'price_asc', icon: ArrowDownNarrowWide},
{label: '+ Cher', val: 'price_desc', icon: ArrowUpNarrowWide},
{label: 'Notes', val: 'stars', icon: Star},
].map((opt) => (
<button
key={opt.val}
type="button"
onClick={() => handleSortChange(opt.val)}
className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${
filters.sortBy === opt.val
? 'border-primary bg-primary font-medium text-primary-foreground'
: 'bg-background hover:bg-muted'
}`}
>
{opt.icon && <opt.icon className="h-3 w-3" />}
{opt.label}
</button>
))}
</div>
</div>


{/* ─────────────────────────────────────────────────────
    SECTION CATÉGORIES
    ───────────────────────────────────────────────────── */}
<div>
<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
Catégories
</h4>
<div className="grid grid-cols-2 gap-2">
{/* Affiche 6 catégories ou toutes selon expandCats */}
{(expandCats ? categories : categories.slice(0, 6)).map((cat) => (
<div
key={cat}
onClick={() => toggleFilterArray('categories', cat)}
className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 transition-colors ${
filters.categories.includes(cat)
? 'border-primary bg-primary/10'
: 'border-transparent hover:bg-muted'
}`}
>
{/* Checkbox visuelle */}
<div
className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
filters.categories.includes(cat)
? 'border-primary bg-primary'
: 'border-muted-foreground'
}`}
>
{filters.categories.includes(cat) && (
<Check className="h-3 w-3 text-white" />
)}
</div>
<span className="truncate text-sm">{cat}</span>
</div>
))}

{/* Bouton Voir plus / Moins */}
<button
type="button"
onClick={() => setExpandCats(!expandCats)}
className="col-span-2 mt-1 flex items-center justify-center gap-1 py-1 text-xs font-medium text-primary hover:underline"
>
{expandCats ? (
<>
<Minus className="h-3 w-3" /> Moins
</>
) : (
<>
<Plus className="h-3 w-3" /> Voir plus
</>
)}
</button>
</div>
</div>


{/* ─────────────────────────────────────────────────────
    SECTION MARQUES
    ───────────────────────────────────────────────────── */}
<div>
<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
Marques
</h4>
<div className="flex flex-wrap gap-2">
{/* Affiche 6 marques ou toutes selon expandBrands */}
{(expandBrands ? ALL_BRANDS : ALL_BRANDS.slice(0, 6)).map((brand) => (
<button
key={brand}
type="button"
onClick={() => toggleFilterArray('brands', brand)}
className={`rounded-md border px-3 py-1 text-xs transition-all ${
filters.brands.includes(brand)
? 'border-primary bg-primary text-primary-foreground'
: 'border-input hover:bg-muted'
}`}
>
{brand}
</button>
))}

{/* Bouton expand/collapse */}
<button
type="button"
onClick={() => setExpandBrands(!expandBrands)}
className="flex items-center rounded-full border border-dashed border-primary px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
>
{expandBrands ? (
<Minus className="h-3 w-3" />
) : (
<Plus className="h-3 w-3" />
)}
</button>
</div>
</div>


{/* ─────────────────────────────────────────────────────
    SECTION VENDEURS
    ───────────────────────────────────────────────────── */}
<div>
<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
Vendeurs
</h4>
<div className="flex flex-wrap gap-2">
{AVAILABLE_SELLERS.map((seller) => (
<button
key={seller}
type="button"
onClick={() => toggleFilterArray('sellers', seller)}
className={`rounded-md border px-3 py-1 text-xs transition-all ${
filters.sellers.includes(seller)
? 'border-primary bg-primary text-primary-foreground'
: 'border-input hover:bg-muted'
}`}
>
{seller}
</button>
))}
</div>
</div>


{/* ─────────────────────────────────────────────────────
    SECTION BUDGET / PRIX
    ───────────────────────────────────────────────────── */}
<div className="pb-2">
<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
Budget
</h4>
<div className="flex items-center gap-2">
{/* Input prix minimum */}
<div className="relative flex-1">
<span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Min</span>
<Input
type="number"
className="h-9 pl-9"
value={filters.minPrice}
onChange={(e) => handlePriceChange('minPrice', e.target.value)}
/>
</div>

<span className="text-muted-foreground">-</span>

{/* Input prix maximum */}
<div className="relative flex-1">
<span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Max</span>
<Input
type="number"
className="h-9 pl-9"
value={filters.maxPrice}
onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
/>
</div>
</div>
</div>

</div>


{/* ═══════════════════════════════════════════════════════
    FOOTER DU PANNEAU
    ═══════════════════════════════════════════════════════ */}
<div className="flex shrink-0 items-center justify-between rounded-b-xl border-t bg-background p-4">

{/* Bouton reset tous les filtres */}
<button
type="button"
onClick={() =>
setFilters({
categories: [],
brands: [],
sellers: [],
minPrice: '',
maxPrice: '',
sortBy: 'pertinence',
})
}
className="text-xs text-muted-foreground underline transition-colors hover:text-red-500"
>
Tout effacer
</button>

{/* Bouton appliquer les filtres */}
<Button size="sm" onClick={handleApplyFilters}>
Voir les résultats
</Button>
</div>

</div>
)}

</div>
);
}
