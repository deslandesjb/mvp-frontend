// import {Button} from '@/components/ui/button';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {Star} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';

function AllProducts() {
	const [startIndex, setStartIndex] = useState(1);
	const [productsNumber, setProductsNumber] = useState(15);
	const [productList, setProductList] = useState([]);

	const fetchProducts = async () => {
		const newProducts = [];

		for (let i = startIndex; i <= productsNumber; i++) {
			const response = await fetch(`http://localhost:3000/products/`);
			const data = await response.json();
			console.log('bl', data.products[i]);
			console.log(i);

			newProducts.push(data.products[i]);
		}

		setProductList([...productList, ...newProducts]);
		setStartIndex(startIndex + productsNumber);
		setProductsNumber(productsNumber + productsNumber);
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	// useEffect(() => {
	// 	fetch('http://localhost:3000/products/')
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			// setArticlesData(data.articles.filter((data, i) => i > 0));
	// 			if (data.result) {
	// 				setProductList(data.products);
	// 			}
	// 		});
	// }, []);

	// console.log(productList[0].picture[0]);
	const products = productList.map((data, i) => {
		const stars = [];
		// if (data) {
		for (let i = 0; i < 5; i++) {
			let starClass = ' stroke-zinc-900';
			if (i < data.noteMoy - 1) {
				starClass += ' fill-orange';
			}
			stars.push(<Star key={i} strokeWidth={1} size={18} className={starClass} />);
		}

		return (
			<Card key={i} className="w-[17%] min-w-60 overflow-hidden hover:shadow-lg">
				<Link href={'products/' + data.id} className="inline-block h-full">
					<Image src={data.picture[0].url} alt={data.picture[0].title} width={600} height={314} />
					<CardHeader>
						<CardTitle>{data.name}</CardTitle>
						<CardDescription>{data.desc}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex">{stars}</div>
						<div className="flex justify-between">
							<p className="font-bold">{data.priceMoy}€</p>
							{/* <p>{data.noteMoy}</p> */}
						</div>
						{/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
					</CardContent>
				</Link>
			</Card>
		);
		// }
	});

	return (
		<>
			<main className="font-body">
				<section className="flex min-h-96 flex-col items-center justify-center">
					<h1 className="font-title text-4xl">ALL PRODUCTS</h1>
				</section>
				<section className="px-4">
					<div>filtres</div>
					<div className="products-container flex flex-wrap justify-between gap-4">{products}</div>
					<div className="my-8 flex items-center justify-center">
						<Button
							className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm"
							onClick={() => fetchProducts()}>
							Next
						</Button>
					</div>
				</section>
			</main>
		</>
	);
}

export default AllProducts;
