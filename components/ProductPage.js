import Image from 'next/image';
// import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {Star} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

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

		fetch(`https://mvp-backend-seven.vercel.app/products/id/${id}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setProductInfo(data.product);
					setProductData(true);
					console.log(data.product);
				}
			});
	}, [id]);

	const starsShow = (note) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			let starClass = 'stroke-zinc-900';
			if (i < note - 1) {
				starClass += ' fill-orange';
			}
			stars.push(<Star key={i} strokeWidth={1} size={18} className={starClass} />);
		}
		return stars;
	};

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
						<p className="flex"> {starsShow(avis.note)}</p>
					</CardContent>
				</Card>
			))}
		</>
	));

	// sellers CTA + price
	const sellerLinks = productInfo?.sellers?.map((s, i) => {
		return (
			<Button key={i} className="bg-orange p-0 hover:bg-orangehover">
				<Link href={s.url} target="_blank" className="h-full w-full px-4 py-2">
					{s.seller} | <b>{s.price}€</b>
				</Link>
			</Button>
		);
	});

	return (
		<main className="mt-16 flex min-h-screen flex-col items-center justify-center px-8 font-body">
			{productData && (
				<>
					<section className="flex w-full flex-col md:flex-row">
						<div className="md:w-1/2">
							{productInfo.picture && (
								<Image
									className="w-full max-w-2xl"
									src={productInfo.picture[0].url}
									alt={productInfo.picture[0].title}
									width={200}
									height={200}
								/>
							)}
						</div>
						<div className="flex max-w-5xl flex-col justify-center md:w-1/2">
							<div>
								<h1 className="mb-4 text-3xl font-bold">{productInfo.name}</h1>
								<h2>{productInfo.desc}</h2>
							</div>
							<div>
								<p className="mb-2">
									Prix moyen: <b>{productInfo.priceMoy}€</b>
								</p>
								<p className="mb-2 flex">{starsShow(productInfo.noteMoy)}</p>
							</div>
							<div>
								<h3>
									<i>Marque : </i>
									<Link className="text-orange underline hover:text-orangehover" href={`/?brands=${productInfo.brand}`}>
										{productInfo.brand}
									</Link>
								</h3>
								<h3>
									<i>Catégorie : </i>
									<Link
										className="text-orange underline hover:text-orangehover"
										href={`/?categories=${productInfo.categorie}`}>
										{productInfo.categorie}
									</Link>
								</h3>
							</div>
							<div>
								<h2 className="mb-2 mt-4 text-lg underline">Ou acheter</h2>
								<div className="flex flex-wrap gap-4">{sellerLinks}</div>
							</div>
						</div>
					</section>
					<section>
						<h2 className="mb-16 mt-4 text-3xl">Voir les avis</h2>
					</section>
					<section className="mb-32 flex flex-wrap justify-center gap-4 md:justify-between">{notes}</section>
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
