'use client'; // Composant exécuté côté client (Next.js)

// ==============================
// IMPORTS
// ==============================
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation'; // Lecture des paramètres dans l’URL
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import ProductCard from './ProductCard';
// import { useSelector } from 'react-redux';
import { Toaster } from "@/components/ui/sonner"


function AllProducts() {
	// ==============================
	// PARAMÈTRES URL (recherche)
	// ==============================
	const searchParams = useSearchParams(); // Permet de savoir si on est en mode recherche

    // ==============================
    // ÉTATS PAGINATION (mode défaut)
    // ==============================
    const [startIndex, setStartIndex] = useState(1);
    const [productsNumber, setProductsNumber] = useState(12);
    const [productFullLength, setProductFullLength] = useState(0);

    // ==============================
    // ÉTATS DONNÉES
    // ==============================
    const [productList, setProductList] = useState([]); // Produits affichés
    const [categories, setCategories] = useState([]);   // Catégories
    const [listsData, setListsData] = useState([]);     // Listes utilisateur

    // ==============================
    // AUTH
    // ==============================
    const token = useSelector((state) => state.user.token);

	// ==============================
	// MODE ACTIF : recherche ou défaut
	// ==============================
	const [isSearchMode, setIsSearchMode] = useState(false);

	// ==========================================
	// 1. CHARGEMENT PAR DÉFAUT (pagination simple)
	// ==========================================
	const fetchDefaultProducts = async () => {
		const newProducts = [];

		// On charge les produits par tranche (12 par 12)
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

		// On ajoute les nouveaux produits à la liste existante
		setProductList((prev) => [...prev, ...newProducts]);

		// On prépare la prochaine pagination
		setStartIndex(startIndex + 12);
		setProductsNumber(productsNumber + 12);
	};

	// ==========================================
	// 2. CHARGEMENT DES RÉSULTATS DE RECHERCHE
	// ==========================================
	const fetchSearchResults = async () => {
		try {
			// Construction du payload à partir de l’URL
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

			// En recherche, on remplace toute la liste
			setProductList(data.result ? data.products : []);
		} catch (error) {
			console.error('Erreur fetch search:', error);
		}
	};

	// ==========================================
	// 3. BASCULE AUTOMATIQUE : RECHERCHE / DÉFAUT
	// ==========================================
	useEffect(() => {
		// Vérifie si au moins un filtre est présent dans l’URL
		const hasParams =
			searchParams.has('q') ||
			searchParams.has('categories') ||
			searchParams.has('brands') ||
			searchParams.has('sellers') ||
			searchParams.has('minPrice') ||
			searchParams.has('sortBy');

		if (hasParams) {
			// MODE RECHERCHE
			setIsSearchMode(true);
			setProductList([]); // Évite de mixer avec l’ancien contenu
			fetchSearchResults();
		} else {
			// MODE PAR DÉFAUT
			setIsSearchMode(false);

            // Chargement initial uniquement si vide
            if (productList.length === 0) {
                fetchDefaultProducts();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // Se relance à chaque changement d’URL

    // ==========================================
    // 4. RÉCUPÉRATION DES LISTES UTILISATEUR
    // ==========================================
    const allLists = () => {
        token &&
            fetch(`http://localhost:3000/lists/${token}`)
                .then((response) => response.json())
                .then((listsUser) => setListsData(listsUser));
    };

    useEffect(() => {
        allLists();
    }, []);

	// ==========================================
	// 5. RÉCUPÉRATION DES CATÉGORIES
	// ==========================================
	useEffect(() => {
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => data.result && setCategories(data.categories));
	}, []);

	// ==========================================
	// 6. AFFICHAGE (JSX)
	// ==========================================

	// Liens catégories
	const catShow = categories.map((cat, i) => (
		<Link
			key={i}
			href={`/allproducts?categories=${cat}`}
			className="rounded border bg-white px-3 py-1 transition-colors first-letter:uppercase hover:text-orange">
			{cat}
		</Link>
	));

    // Cards produits
    const products = productList.map((data, i) =>
        data ? (
            <ProductCard
                key={i}
                {...data}
                listNames={listsData.listsUser || []}
                allLists={allLists}
            />
        ) : null
    );

    return (
        <main className="font-body bg-slate-50 min-h-screen pb-10">
            {/* HEADER */}       
						<Toaster position="top-right" />
            <section className="flex min-h-96 flex-col items-center justify-center bg-gradient-to-tr from-lightblue to-darkblue">
                <h1 className="font-title text-4xl tracking-tight text-slate-100 uppercase">
                    {isSearchMode ? 'Résultats de recherche' : 'All Products'}
                </h1>

				{/* Reset recherche */}
				{isSearchMode && (
					<Button variant="secondary" className="mt-4" onClick={() => (window.location.href = '/allproducts')}>
						Tout afficher
					</Button>
				)}
			</section>

			<section className="mx-auto max-w-[1600px] px-4 py-8">
				{/* Catégories visibles uniquement hors recherche */}
				{!isSearchMode && <div className="my-8 flex flex-wrap justify-center gap-4">{catShow}</div>}

				<div className="products-container flex flex-wrap justify-center gap-4 md:justify-between">{products}</div>

				{/* Aucun résultat */}
				{productList.length === 0 && isSearchMode && (
					<div className="py-12 text-center text-gray-500">Aucun produit ne correspond à vos critères 🫤</div>
				)}

				{/* Pagination (mode défaut uniquement) */}
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
		</main>
	);
}

export default AllProducts;
