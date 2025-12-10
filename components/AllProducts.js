// import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {Star} from 'lucide-react';
import Image from 'next/image';
import {useEffect, useState} from 'react';

function AllProducts() {
	const [productList, setProductList] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3000/products/')
			.then((response) => response.json())
			.then((data) => {
				// setArticlesData(data.articles.filter((data, i) => i > 0));
				if (data.result) {
					setProductList(data.products);
				}
			});
	}, []);

	// console.log(productList[0].picture[0]);
	const products = productList.map((data, i) => {
		console.log(data);

		const stars = [];
		for (let i = 0; i < 5; i++) {
			let starClass = ' stroke-zinc-900';
			if (i < data.noteMoy - 1) {
				starClass += ' fill-orange';
			}
			stars.push(<Star key={i} strokeWidth={1} size={18} className={starClass} />);
		}

		return (
			<Card key={i} className="w-[17%] min-w-60 overflow-hidden">
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
					<div className="mt-auto flex justify-between">
						<p>{data.brand}</p>
						<p>{data.categorie}</p>
					</div>
				</CardContent>
			</Card>
		);
	});

	return (
		<>
			<main className="font-body">
				<section className="flex min-h-96 flex-col items-center justify-center">
					<h1 className="font-title text-4xl">ALL PRODUCTS</h1>
				</section>
				<section className="px-4">
					{/* <Button className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm">
						AllProducts
					</Button> */}
					<div>filtres</div>
					<div className="products-container flex flex-wrap justify-between gap-4">{products}</div>
				</section>
			</main>
		</>
	);
}

export default AllProducts;
