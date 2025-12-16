// import {Button} from '@/components/ui/button';
// import Link from 'next/link';
// import {useEffect, useState} from 'react';
// import ProductCard from './ProductCard';

// function AllProducts() {
// 	const [startIndex, setStartIndex] = useState(1);
// 	const [productsNumber, setProductsNumber] = useState(12);
// 	const [productFullLength, setProductFullLength] = useState(0);
// 	// const [defaultNumberToAdd, setDefaultNumberToAdd] = useState(12);
// 	const [productList, setProductList] = useState([]);
// 	const [categories, setCategories] = useState([]);
// 	// const size = useWindowSize();

// 	const fetchProducts = async () => {
// 		const newProducts = [];

// 		for (let i = startIndex; i <= productsNumber; i++) {
// 			const response = await fetch(`http://localhost:3000/products`);
// 			const data = await response.json();
// 			// console.log('product', data.products[i]);
// 			// console.log(i);

// 			setProductFullLength(data.products.length);
// 			newProducts.push(data.products[i]);
// 		}

// 		setProductList([...productList, ...newProducts]);
// 		setStartIndex(startIndex + 12);
// 		setProductsNumber(productsNumber + 12);
// 	};
// 	// console.log('productFullLength', productFullLength);

// 	// console.log(productsNumber);
// 	useEffect(() => {
// 		fetchProducts();
// 	}, []);

// 	useEffect(() => {
// 		fetch('http://localhost:3000/products/categories')
// 			.then((response) => response.json())
// 			.then((data) => {
// 				// setArticlesData(data.articles.filter((data, i) => i > 0));
// 				if (data.result) {
// 					setCategories(data.categories);
// 				}
// 			});
// 	}, []);

// 	const catShow = categories.map((data, i) => {
// 		return (
// 			<Link key={i} href={data} className="first-letter:uppercase">
// 				{data}
// 			</Link>
// 		);
// 	});

// 	// ------------------------------ ajt fetch list
// 	const [listsData, setListsData] = useState([]);
// 	const allLists = () => {
// 		fetch('http://localhost:3000/lists/S_GecKwSKafozaCV0BfnpDYgTkh1nXwd')
// 			.then((response) => response.json())
// 			.then((listsUser) => {
// 				setListsData(listsUser);
// 			});
// 	};
// 	useEffect(() => {
// 		allLists();
// 	}, []);

// 	// -------------- passage en props list
// 	const products = productList.map((data, i) => {
// 		if (data) {
// 			return <ProductCard key={i} {...data} listNames={listsData.listsUser} />;
// 		}
// 	});

// 	return (
// 		<>
// 			<main className="font-body">
// 				<section className="flex min-h-96 flex-col items-center justify-center bg-gradient-to-tr from-lightblue to-darkblue">
// 					<h1 className="font-title text-4xl tracking-tight text-slate-100">ALL PRODUCTS</h1>
// 				</section>
// 				<section className="px-4">
// 					<div className="my-4 flex flex-wrap justify-center gap-4">{catShow}</div>
// 					<div className="products-container flex flex-wrap justify-center gap-4 md:justify-between">{products}</div>
// 					<div className="my-8 flex items-center justify-center">
// 						{productsNumber < productFullLength && (
// 							<Button
// 								className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm"
// 								onClick={() => fetchProducts()}>
// 								Next
// 							</Button>
// 						)}
// 					</div>
// 				</section>
// 			</main>
// 		</>
// 	);
// }

// export default AllProducts;
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Essentiel pour lire l'URL
import ProductCard from './ProductCard';

function AllProducts() {
    const searchParams = useSearchParams(); // On récupère l'URL pour savoir si on cherche ou pas

    // --- ÉTATS ---
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listsData, setListsData] = useState([]);
    
    // États pagination (Mode par défaut)
    const [startIndex, setStartIndex] = useState(1);
    const [productsNumber, setProductsNumber] = useState(12);
    const [productFullLength, setProductFullLength] = useState(0);

    // État clé : Est-on en mode recherche ?
    const [isSearchMode, setIsSearchMode] = useState(false);

    // ==========================================
    // 1. FONCTION : CHARGEMENT PAR DÉFAUT (Ta boucle d'origine)
    // ==========================================
    const fetchDefaultProducts = async () => {
        const newProducts = [];
        for (let i = startIndex; i <= productsNumber; i++) {
            try {
                // Port 3000
                const response = await fetch(`http://localhost:3000/products`);
                const data = await response.json();
                if (data.products && data.products[i]) {
                    setProductFullLength(data.products.length);
                    newProducts.push(data.products[i]);
                }
            } catch (error) {
                console.error("Erreur fetch default:", error);
            }
        }
        setProductList((prev) => [...prev, ...newProducts]);
        setStartIndex(startIndex + 12);
        setProductsNumber(productsNumber + 12);
    };

    // ==========================================
    // 2. FONCTION : CHARGEMENT RECHERCHE
    // ==========================================
    const fetchSearchResults = async () => {
        try {
            // On reconstruit le payload pour le backend à partir de l'URL
            const payload = {
                search: searchParams.get('q') || '',
                categories: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
                brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
                sellers: searchParams.get('sellers') ? searchParams.get('sellers').split(',') : [],
                minPrice: searchParams.get('minPrice'),
                maxPrice: searchParams.get('maxPrice'),
                sortBy: searchParams.get('sortBy')
            };

            const response = await fetch('http://localhost:3000/products/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.result) {
                setProductList(data.products); // On remplace TOUT par les résultats
            } else {
                setProductList([]); // 0 résultat
            }
        } catch (error) {
            console.error('Erreur fetch search:', error);
        }
    };

    // ==========================================
    // LOGIQUE DE BASCULE (IF / ELSE)
    // ==========================================
    useEffect(() => {
        // Y a-t-il des paramètres de recherche ?
        const hasParams = 
            searchParams.has('q') || 
            searchParams.has('categories') || 
            searchParams.has('brands') || 
            searchParams.has('sellers') ||
            searchParams.has('minPrice') || 
            searchParams.has('sortBy');

        if (hasParams) {
            // OUI -> MODE RECHERCHE
            setIsSearchMode(true);
            setProductList([]); // On vide avant de charger pour éviter de mixer les produits
            fetchSearchResults();
        } else {
            // NON -> MODE DÉFAUT
            setIsSearchMode(false);
            // On ne lance la boucle par défaut que si la liste est vide (premier chargement)
            if (productList.length === 0) {
                fetchDefaultProducts();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // Se relance à chaque fois que l'URL change


    // ==========================================
    // AUTRES FETCHS (Catégories & Listes)
    // ==========================================
    useEffect(() => {
        fetch('http://localhost:3000/products/categories')
            .then((response) => response.json())
            .then((data) => { if (data.result) setCategories(data.categories); });
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/lists/S_GecKwSKafozaCV0BfnpDYgTkh1nXwd')
            .then((response) => response.json())
            .then((listsUser) => { setListsData(listsUser); });
    }, []);


    // ==========================================
    // RENDER
    // ==========================================
    
    // Affichage des catégories (liens)
    const catShow = categories.map((data, i) => (
        <Link key={i} href={`/allproducts?categories=${data}`} className="first-letter:uppercase px-3 py-1 bg-white border rounded hover:text-orange transition-colors">
            {data}
        </Link>
    ));

    // Affichage des produits
    const products = productList.map((data, i) => {
        if (data) {
            // Sécurité pour éviter crash si listsData pas encore chargé
            return <ProductCard key={i} {...data} listNames={listsData?.listsUser || []} />;
        }
        return null;
    });

    return (
        <main className="font-body bg-slate-50 min-h-screen pb-10">
            {/* HEADER */}
            <section className="flex min-h-96 flex-col items-center justify-center bg-gradient-to-tr from-lightblue to-darkblue">
                <h1 className="font-title text-4xl tracking-tight text-slate-100 uppercase">
                    {isSearchMode ? 'Résultats de recherche' : 'All Products'}
                </h1>
                
                {/* Bouton pour annuler la recherche si actif */}
                {isSearchMode && (
                    <Button variant="secondary" className="mt-4" onClick={() => window.location.href = '/allproducts'}>
                        Tout afficher
                    </Button>
                )}
            </section>

            <section className="px-4 py-8 max-w-[1600px] mx-auto">
                {/* On cache les liens catégories si on est en mode recherche pour ne pas surcharger */}
                {!isSearchMode && (
                    <div className="my-8 flex flex-wrap justify-center gap-4">
                        {catShow}
                    </div>
                )}

                <div className="products-container flex flex-wrap justify-center gap-4 md:justify-between">
                    {products}
                </div>

                {/* Si aucun résultat en recherche */}
                {productList.length === 0 && isSearchMode && (
                    <div className="text-center py-12 text-gray-500">Aucun produit ne correspond à vos critères de recherche 🫤 .</div>
                )}

                {/* Bouton NEXT (Uniquement en mode défaut) */}
                <div className="my-12 flex items-center justify-center">
                    {!isSearchMode && productsNumber < productFullLength && (
                        <Button
                            className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm px-8 py-6"
                            onClick={() => fetchDefaultProducts()}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AllProducts;