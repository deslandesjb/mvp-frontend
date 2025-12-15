'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchInput({
	categorie,
	brand,
	seller,
	onSelect
}) {
	const [value, setValue] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const abortRef = useRef(null);
	const containerRef = useRef(null);

	// =========================
	// CLOSE ON OUTSIDE CLICK
	// =========================
	useEffect(() => {
		const handler = (e) => {
			if (!containerRef.current?.contains(e.target)) {
				setResults([]);
			}
		};

		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	// =========================
	// SEARCH (DEBOUNCE)
	// =========================
	useEffect(() => {
		if (!value.trim()) {
			setResults([]);
			return;
		}

		if (abortRef.current) abortRef.current.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		const timeout = setTimeout(async () => {
			setLoading(true);

			try {
				const params = new URLSearchParams({
					q: value,
					limit: 6
				});

				if (categorie) params.append('categorie', categorie);
				if (brand) params.append('brand', brand);
				if (seller) params.append('seller', seller);

				const res = await fetch(
					`http://localhost:3001/search?${params.toString()}`,
					{ signal: controller.signal }
				);

				const data = await res.json();
				setResults(data.results || []);
			} catch (err) {
				if (err.name !== 'AbortError') console.error(err);
			} finally {
				setLoading(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [value, categorie, brand, seller]);

	// =========================
	// RENDER
	// =========================
	return (
		<div ref={containerRef} className="relative w-full max-w-md">

			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Rechercher un produit..."
			/>

			{loading && (
				<div className="absolute mt-1 w-full rounded-md border bg-background p-2 text-sm">
					Recherche...
				</div>
			)}

			{results.length > 0 && (
				<ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow">
					{results.map(product => (
						<li
							key={product.sku}
							onClick={() => {
								setValue(product.name);
								setResults([]);
								onSelect && onSelect(product);
							}}
							className="flex gap-3 p-2 cursor-pointer hover:bg-muted"
						>
							<img
								src={product.picture?.[0]?.url}
								className="h-10 w-10 rounded object-cover"
								alt={product.name}
							/>
							<div>
								<p className="text-sm font-medium line-clamp-1">
									{product.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{product.brand} • {product.price}€
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
