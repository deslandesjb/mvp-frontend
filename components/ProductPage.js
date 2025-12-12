import Image from 'next/image';
// import React from 'react';
import React, {useEffect, useState} from 'react';

export default function ProductPage() {
	const [productInfo, setProductInfo] = useState({});

	useEffect(() => {
		fetch('http://localhost:3000/products/id/69383ba502d195cb6577d535')
			.then((response) => response.json())
			.then((data) => {
				// setArticlesData(data.articles.filter((data, i) => i > 0));
				// console.log(data);
				if (data.result) {
					setProductInfo(data.product);
				}
			});
	}, []);

	console.log(productInfo);

	// const sellers = productInfo.sellers.map((seller, i) => {
	//   return()
	// });

	return (
		<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
			<section>
				<div>
					{productInfo.picture && (
						<Image src={productInfo.picture[0].url} alt={productInfo.picture[0].url} width={200} height={200} />
					)}
				</div>
				<div>
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
			</section>
		</main>
	);
}
