// import {Button} from '@/components/ui/button';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import ProductCard from './ProductCard';

function AllProducts() {
	const [startIndex, setStartIndex] = useState(1);
	const [productsNumber, setProductsNumber] = useState(15);
	const [productFullLength, setProductFullLength] = useState(0);
	const [productList, setProductList] = useState([]);
	const [categories, setCategories] = useState([]);

	const fetchProducts = async () => {
		const newProducts = [];

		for (let i = startIndex; i <= productsNumber; i++) {
			const response = await fetch(`http://localhost:3000/products`);
			const data = await response.json();
			// console.log('product', data.products[i]);
			// console.log(i);

			setProductFullLength(data.products.length);
			newProducts.push(data.products[i]);
		}

		setProductList([...productList, ...newProducts]);
		setStartIndex(startIndex + 15);
		setProductsNumber(productsNumber + 15);
	};
	console.log('productFullLength', productFullLength);

	console.log(productsNumber);
	useEffect(() => {
		fetchProducts();
	}, []);

	useEffect(() => {
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => {
				// setArticlesData(data.articles.filter((data, i) => i > 0));
				if (data.result) {
					setCategories(data.categories);
				}
			});
	}, []);

	const catShow = categories.map((data, i) => {
		return (
			<Link key={i} href={data} className="first-letter:uppercase">
				{data}
			</Link>
		);
	});

	const products = productList.map((data, i) => {
		if (data) {
			return <ProductCard key={i} {...data} />;
		}
	});

	return (
		<>
			<main className="font-body">
				<section className="flex min-h-96 flex-col items-center justify-center bg-gradient-to-tr from-lightblue to-darkblue">
					<h1 className="font-title text-4xl tracking-tight text-slate-100">ALL PRODUCTS</h1>
				</section>
				<section className="px-4">
					<div className="my-4 flex justify-center gap-4">{catShow}</div>
					<div className="products-container flex flex-wrap justify-between gap-4">{products}</div>
					<div className="my-8 flex items-center justify-center">
						{productsNumber < productFullLength && (
							<Button
								className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm"
								onClick={() => fetchProducts()}>
								Next
							</Button>
						)}
					</div>
				</section>
			</main>
		</>
	);
}

export default AllProducts;
