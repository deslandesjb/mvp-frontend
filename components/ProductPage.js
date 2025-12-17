import Image from 'next/image';
// import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

export default function ProductPage() {
	const [productInfo, setProductInfo] = useState({});
	const [productData, setProductData] = useState(false);
	// extraire ID produit de l'url
	const router = useRouter();
	const {id} = router.query;

	useEffect(() => {
		if (!id || id === 'undefined') {
			return;
		}

		fetch(`http://localhost:3000/products/id/${id}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setProductInfo(data.product);
					setProductData(true);
					// console.log(data.product);
				}
			});
	}, [id]);

	const notes = productInfo?.sellers?.map((seller, i) => (
		<>
			{seller.avis.map((avis, j) => (
				<Card
					key={j}
					className="w-full max-w-xl overflow-hidden hover:shadow-lg md:w-[calc(50%-1rem)] xl:w-[calc(33.3%-1rem)]">
					<CardHeader>
						<CardTitle>{seller.seller}</CardTitle>
						<CardDescription>{seller.content}</CardDescription>
					</CardHeader>
					<CardContent>
						<p> {avis.content}</p>
						<p> {avis.note}</p>
					</CardContent>
				</Card>
			))}
		</>
	));

	// console.log(productInfo.sellers);
	// console.log('notes', notes);

	return (
		<main className="flex min-h-screen-header flex-col items-center justify-center font-body">
			{productData && (
				<>
					<section className="flex">
						<div className="w-1/2">
							{productInfo.picture && (
								<Image
									className="w-full"
									src={productInfo.picture[0].url}
									alt={productInfo.picture[0].title}
									width={200}
									height={200}
								/>
							)}
						</div>
						<div className="flex w-1/2 flex-col justify-center">
							<div>
								<h1 className="text-xl font-bold">{productInfo.name}</h1>
								<h2>{productInfo.desc}</h2>
							</div>
							<div>
								<p>
									Prix moyen: <b>{productInfo.priceMoy}€</b>
								</p>
								<p>{productInfo.noteMoy}</p>
							</div>
							<div>
								<h3>{productInfo.brand}</h3>
								<h3>{productInfo.categorie}</h3>
							</div>
						</div>
					</section>
					<section className="mb-16 flex flex-wrap justify-center gap-4 md:justify-between">{notes}</section>
				</>
			)}
			{!productData && (
				<section>
					<h1>No data found</h1>
				</section>
			)}
		</main>
	);
}
