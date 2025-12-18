'use client'; // Composant exécuté côté client (Next.js)

// ==============================
// IMPORTS
// ==============================
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation'; // Lecture des paramètres dans l’URL

import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Filter from './FilterComp';
import ProductCard from './ProductCard';
import SearchComp from './SearchComp';
// import { useSelector } from 'react-redux';
import {Toaster} from '@/components/ui/sonner';
import Script from 'next/script';

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
	const [listsData, setListsData] = useState([]); // Listes utilisateur

	// ==============================
	// AUTH
	// ==============================
	const token = useSelector((state) => state.user.token);

	// ==============================
	// MODE ACTIF : recherche ou défaut
	// ==============================
	const [isSearchMode, setIsSearchMode] = useState(false);

	// ==========================================
	// 5. GESTION ANIMATION HEADER
	// ==========================================
	const initFinisherHeader = useCallback(() => {
		// On vérifie que le script est bien chargé et disponible dans la fenêtre du navigateur
		if (typeof window !== 'undefined' && window.FinisherHeader) {
			// On cible l'élément qui doit contenir l'animation
			const headerElement = document.querySelector('.finisher-header');
			// On vérifie qu'une animation n'est pas déjà en cours pour éviter les doublons
			if (headerElement && !headerElement.querySelector('canvas')) {
				new window.FinisherHeader({
					count: 100,
					size: {
						min: 2,
						max: 6,
						pulse: 0,
					},
					speed: {
						x: {min: 0, max: 0.4},
						y: {min: 0, max: 0.6},
					},
					colors: {
						background: '#201e30',
						particles: ['#ff9a6c', '#ff7849'],
					},
					blending: 'overlay',
					opacity: {center: 1, edge: 0},
					skew: -2,
					shapes: ['c'],
				});
			}
		}
	}, []);

	// Cet effet se déclenche à chaque fois que le composant est "monté" (affiché)
	useEffect(() => {
		initFinisherHeader();
	}, [initFinisherHeader]);

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
	// 6. AFFICHAGE (JSX)
	// ==========================================

	// Cards produits
	const products = productList.map((data, i) =>
		data ? <ProductCard key={i} {...data} listNames={listsData.listsUser || []} allLists={allLists} /> : null,
	);

	return (
		<main className="-mt-16 min-h-screen bg-slate-50 pb-10 font-body">
			{/* HEADER */}
			<div className="relative min-h-96">
				{/* Background Layer */}
				<section className="finisher-header absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_90%,0_100%)]"></section>
				{/* Content Layer */}
				<h1 className="font-title text-4xl uppercase tracking-tight text-slate-100">
					{isSearchMode ? 'Résultats de la recherche' : 'All Products'}
				</h1>

				{/* Content Layer */}
				<div className="relative z-10 flex h-full min-h-96 flex-col items-center justify-center p-4 text-center">
					<h1 className="font-title text-4xl uppercase tracking-tight text-slate-100">
						{isSearchMode ? 'Résultats de la recherche' : 'All Products'}
					</h1>

					<div className="mt-4 flex w-full max-w-3xl justify-center gap-2">
						<Filter />
						<SearchComp home={true} />
					</div>
					{/* Reset recherche */}
					{isSearchMode && (
						<Button
							className="mt-4 bg-orange text-zinc-900 hover:bg-orangehover"
							onClick={() => (window.location.href = '/')}>
							Afficher tout
						</Button>
					)}
				</div>
			</div>

			<section className="mx-auto max-w-[1600px] px-4 py-8">
				<div className="products-container flex flex-wrap justify-center gap-4 md:justify-start">{products}</div>

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
			<Script src="/finisher-header.es5.min.js" strategy="lazyOnload" onLoad={initFinisherHeader} />
		</main>
	);
}

export default AllProducts;
