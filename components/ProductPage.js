import Image from 'next/image';
// import React from 'react';
import React, {useEffect, useState} from 'react';

export default function ProductPage() {
	const [productInfo, setProductInfo] = useState({});
	const [productData, setProductData] = useState(false);

	useEffect(() => {
		fetch('http://localhost:3000/products/id/693fe4515403bcd12431fcaa')
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setProductInfo(data.product);
					setProductData(true);
				}
			});
	}, []);

	console.log(productInfo.sellers);

	return (
		<main className="min-h-screen-header flex min-h-96 flex-col items-center justify-center font-body">
			{productData && (
				<section className="flex">
					<div className="w-1/2">
						{productInfo.picture && (
							<Image
								className="w-full"
								src={productInfo.picture[0].url}
								alt={productInfo.picture[0].url}
								width={200}
								height={200}
							/>
						)}
					</div>
					<div className="w-1/2">
						<div>
							<h1>{productInfo.name}</h1>
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
					{productInfo.sellers.map((seller, i) => {
						seller.avis.map((avis, j) => {
							console.log(avis.content);
						});

						return (
							<div key={i}>
								<div>{seller.price}</div>
								{/* <div>{avis.content}</div> */}
								<div>{seller.seller}</div>
							</div>
						);
					})}
				</section>
			)}
			{!productData && (
				<section>
					<h1>No data found</h1>
				</section>
			)}
		</main>
	);
}
