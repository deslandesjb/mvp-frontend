'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Star, Check, Store, Plus, Minus, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';

// --- DONNÉES DE DÉMO (Peuvent être remplacées par un fetch API 'categories' plus tard) ---
const ALL_CATEGORIES = [
    "Casque", "Clavier", "Souris", "Écran", "Laptop", // Populaires
    "Webcam", "Microphone", "Enceinte", "Tablette", "Smartphone", "Disque Dur", "Composant PC", "Imprimante", "Réseau"
];

const ALL_BRANDS = [
    "Sony", "Apple", "Logitech", "Samsung", "Asus", // Populaires
    "Dell", "HP", "Razer", "Corsair", "Bose", "JBL", "Lenovo", "MSI", "Acer", "Microsoft"
];

const AVAILABLE_SELLERS = ["Amazon", "Darty", "Fnac"];

export default function SearchInput({ onSelect }) {
    // --- ÉTATS ---
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // États d'expansion ("Voir plus")
    const [expandCats, setExpandCats] = useState(false);
    const [expandBrands, setExpandBrands] = useState(false);

    // État des filtres
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        sellers: [],
        minPrice: '',
        maxPrice: '',
        sortBy: 'pertinence'
    });

    const router = useRouter();
    const containerRef = useRef(null);
    const filterRef = useRef(null);

    // --- 1. FONCTION FETCH ---
    const fetchData = async () => {
        try {
            const payload = {
                search: query,
                ...filters
            };

            const response = await fetch('http://localhost:3001/products/search', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) return;
            const data = await response.json();

            if (data.result) {
                setResults(data.products || []); 
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Erreur fetch:", error);
        }
    };

    // --- EFFET : Déclenche la recherche ---
    useEffect(() => {
        const hasActiveFilters = 
            filters.categories.length > 0 || 
            filters.brands.length > 0 || 
            filters.sellers.length > 0 ||
            filters.minPrice || 
            filters.maxPrice ||
            filters.sortBy !== 'pertinence';
        
        if (!query.trim() && !hasActiveFilters) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timeout);
    }, [query, filters]);


    // --- HANDLERS (Gestion des clics) ---
    
    // Ajoute ou retire un élément d'un tableau de filtres
    const toggleFilterArray = (field, value) => {
        setFilters(prev => {
            const list = prev[field];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    const handlePriceChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSortChange = (value) => {
        setFilters(prev => ({ ...prev, sortBy: value }));
    };

    // Compteur de filtres actifs (Badge rouge)
    const activeCount = 
        filters.categories.length + 
        filters.brands.length + 
        filters.sellers.length + 
        (filters.minPrice || filters.maxPrice ? 1 : 0) +
        (filters.sortBy !== 'pertinence' ? 1 : 0);

    // Fermeture au clic extérieur
    useEffect(() => {
        const handler = (e) => {
            if (!containerRef.current?.contains(e.target) && !filterRef.current?.contains(e.target)) {
                setResults([]);
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);


    // --- RENDER ---
    return (
        <div className="relative w-full max-w-2xl mx-auto font-sans" ref={containerRef}>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowFilters(false); }} className="flex w-full items-center gap-2">
                
                {/* ======================================================= */}
                {/* A. BOUTON FILTRES (GAUCHE) */}
                {/* ======================================================= */}
                <div className="relative" ref={filterRef}>
                    <Button 
                        type="button"
                        variant={showFilters ? "secondary" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`relative px-3 border-dashed ${activeCount > 0 ? 'border-solid border-primary bg-primary/5 text-primary' : ''}`}
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Filtres</span>
                        
                        {activeCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">
                                {activeCount}
                            </span>
                        )}
                    </Button>

                    {/* --- MODAL DÉROULANT (CORRIGÉ : SCROLLABLE & HAUTEUR FIXE) --- */}
                    {showFilters && (
                        <div className="absolute top-full left-0 mt-2 w-[320px] sm:w-[400px] rounded-xl border bg-popover text-popover-foreground shadow-2xl z-50 animate-in fade-in zoom-in-95 flex flex-col max-h-[60vh] sm:max-h-[500px]">
                            
                            {/* ZONE SCROLLABLE (Contenu) */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                
                                {/* 1. TRI */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">Trier par</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: 'Pertinence', val: 'pertinence', icon: null },
                                            { label: '- Cher', val: 'price_asc', icon: ArrowDownNarrowWide },
                                            { label: '+ Cher', val: 'price_desc', icon: ArrowUpNarrowWide },
                                            { label: 'Notes', val: 'stars', icon: Star },
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                type="button"
                                                onClick={() => handleSortChange(opt.val)}
                                                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-all ${
                                                    filters.sortBy === opt.val 
                                                    ? 'bg-primary text-primary-foreground border-primary font-medium' 
                                                    : 'hover:bg-muted bg-background'
                                                }`}
                                            >
                                                {opt.icon && <opt.icon className="h-3 w-3" />}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. CATÉGORIES */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Catégories</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(expandCats ? ALL_CATEGORIES : ALL_CATEGORIES.slice(0, 6)).map(cat => {
                                            const isSelected = filters.categories.includes(cat);
                                            return (
                                                <div 
                                                    key={cat}
                                                    onClick={() => toggleFilterArray('categories', cat)}
                                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer border transition-colors ${
                                                        isSelected ? 'bg-primary/10 border-primary' : 'border-transparent hover:bg-muted'
                                                    }`}
                                                >
                                                    <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                                        {isSelected && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <span className="text-sm truncate">{cat}</span>
                                                </div>
                                            )
                                        })}
                                        
                                        {/* Bouton Voir Plus */}
                                        <button 
                                            type="button"
                                            onClick={() => setExpandCats(!expandCats)}
                                            className="col-span-2 flex items-center justify-center gap-1 py-1 text-xs text-primary font-medium hover:underline mt-1"
                                        >
                                            {expandCats ? <><Minus className="h-3 w-3" /> Moins</> : <><Plus className="h-3 w-3" /> Voir plus de catégories</>}
                                        </button>
                                    </div>
                                </div>

                                {/* 3. MARQUES */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Marques</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(expandBrands ? ALL_BRANDS : ALL_BRANDS.slice(0, 6)).map(brand => {
                                            const isSelected = filters.brands.includes(brand);
                                            return (
                                                <button
                                                    key={brand}
                                                    type="button"
                                                    onClick={() => toggleFilterArray('brands', brand)}
                                                    className={`px-3 py-1 text-xs rounded-md border transition-all ${
                                                        isSelected 
                                                        ? 'bg-primary text-primary-foreground border-primary' 
                                                        : 'border-input hover:bg-muted'
                                                    }`}
                                                >
                                                    {brand}
                                                </button>
                                            )
                                        })}
                                        <button
                                            type="button"
                                            onClick={() => setExpandBrands(!expandBrands)}
                                            className="px-2 py-1 text-xs rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 transition-colors flex items-center"
                                            title={expandBrands ? "Voir moins" : "Voir plus"}
                                        >
                                            {expandBrands ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                        </button>
                                    </div>
                                </div>

                                {/* 4. VENDEURS */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="h-3 w-3 text-muted-foreground" />
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Vendeurs</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_SELLERS.map(seller => {
                                            const isSelected = filters.sellers.includes(seller);
                                            return (
                                                <button
                                                    key={seller}
                                                    type="button"
                                                    onClick={() => toggleFilterArray('sellers', seller)}
                                                    className={`px-3 py-1 text-xs rounded-md border transition-all ${
                                                        isSelected 
                                                        ? 'bg-primary text-primary-foreground border-primary' 
                                                        : 'border-input hover:bg-muted'
                                                    }`}
                                                >
                                                    {seller}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* 5. BUDGET */}
                                <div className="pb-2">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Budget</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Min</span>
                                            <Input 
                                                type="number" 
                                                className="pl-9 h-9" 
                                                value={filters.minPrice} 
                                                onChange={(e) => handlePriceChange('minPrice', e.target.value)} 
                                            />
                                        </div>
                                        <span className="text-muted-foreground">-</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Max</span>
                                            <Input 
                                                type="number" 
                                                className="pl-9 h-9" 
                                                value={filters.maxPrice} 
                                                onChange={(e) => handlePriceChange('maxPrice', e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ZONE FIXE (Pied de page) */}
                            <div className="p-4 border-t bg-background rounded-b-xl flex justify-between items-center shrink-0">
                                <button 
                                    type="button"
                                    onClick={() => setFilters({ categories: [], brands: [], sellers: [], minPrice: '', maxPrice: '', sortBy: 'pertinence' })}
                                    className="text-xs text-muted-foreground underline hover:text-red-500 transition-colors"
                                >
                                    Tout effacer
                                </button>
                                <Button size="sm" onClick={() => setShowFilters(false)}>
                                    Voir les résultats
                                </Button>
                            </div>

                        </div>
                    )}
                </div>

                {/* ======================================================= */}
                {/* B. RECHERCHE (CENTRE) */}
                {/* ======================================================= */}
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 w-full"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher..."
                    />
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

                {/* ======================================================= */}
                {/* C. BOUTON SUBMIT (DROITE) */}
                {/* ======================================================= */}
                <Button type="submit">
                    <Search className="h-4 w-4" />
                </Button>
            </form>

            {/* ======================================================= */}
            {/* D. RÉSULTATS (DROPDOWN) */}
            {/* ======================================================= */}
            {results.length > 0 && (
                <div className="absolute z-40 mt-2 w-full rounded-lg border bg-background shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
                    <ul>
                        {results.map((item, index) => (
                            <li 
                                key={index} 
                                className="flex gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b last:border-0 transition-colors"
                                onClick={() => {
                                    // router.push(`/products/${item._id}`);
                                    console.log('Produit cliqué:', item.name);
                                }}
                            >
                                {/* IMAGE */}
                                <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden border bg-white flex items-center justify-center">
                                    <img 
                                        src={Array.isArray(item.picture) ? item.picture[0]?.url : (item.picture || '/placeholder.png')} 
                                        alt={item.name} 
                                        className="h-full w-full object-contain"
                                        onError={(e) => e.target.src = '/placeholder.png'}
                                    />
                                </div>
                                
                                {/* CONTENU */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-semibold truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize truncate">
                                            {item.marque || item.brand} • {item.categorie}
                                            {(item.vendeur || item.seller) && (
                                                <> • <span className="text-primary font-medium">{item.vendeur || item.seller}</span></>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="font-bold text-primary">{item.price || item.priceMoy} €</span>
                                        {(item.star || item.noteMoy) && (
                                            <div className="flex items-center bg-yellow-100 text-yellow-700 px-1.5 rounded text-[10px] font-bold">
                                                <Star className="h-3 w-3 fill-current mr-1" />
                                                {item.star || item.noteMoy}
                                            </div>
                                        )}
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