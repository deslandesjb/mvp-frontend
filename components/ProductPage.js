import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

export default function ProductPage() {
	const router = useRouter();
	const {id} = router.query;
	const [productInfo, setProductInfo] = useState({});
	const [productData, setProductData] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		setIsLoading(true);

		fetch(`http://localhost:3000/products/id/${id}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setProductInfo(data.product);
					setProductData(true);
				}
			})
			.catch((error) => {
				console.error('Erreur fetch:', error);
				setProductData(false);
			})
			.finally(() => setIsLoading(false));
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
						<p>{avis.content}</p>
						<p>{avis.note}</p>
					</CardContent>
				</Card>
			))}
		</>
	));

	return (
		<main className="min-h-screen-header flex flex-col items-center justify-center font-body">
			{isLoading && <h1>Chargement...</h1>} {/* ✅ État de chargement */}
			{productData && !isLoading && (
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
			{!productData && !isLoading && (
				<section>
					<h1>No data found</h1>
				</section>
			)}
		</main>
	);
}
