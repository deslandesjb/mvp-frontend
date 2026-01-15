import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card.tsx';
import {Input} from '@/components/ui/input';
import {Search, X} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

export default function SearchComp(props) {
	// console.log(props.home);
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);

	const router = useRouter();
	const containerRef = useRef(null);

	// --- FETCH PREVIEW ---
	const fetchPreviewData = async () => {
		try {
			const response = await fetch('https://mvp-backend-seven.vercel.app/products/search', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({search: query}),
			});

			if (!response.ok) return;
			const data = await response.json();
			setResults(data.result ? data.products || [] : []);
		} catch (error) {
			console.error('Erreur fetch preview:', error);
		}
	};

	// Déclenche la prévisualisation
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}
		const timeout = setTimeout(() => fetchPreviewData(), 300);
		return () => clearTimeout(timeout);
	}, [query]);

	// --- REDIRECTION VERS HOME ---
	const handleSearchSubmit = (e) => {
		if (e) e.preventDefault();
		router.push(`/?q=${encodeURIComponent(query)}`);
		setResults([]);
	};

	// Click outside
	useEffect(() => {
		const handler = (e) => {
			if (!containerRef.current?.contains(e.target)) {
				setResults([]);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	// --- RENDER ---
	return (
		<div className="relative mx-auto w-full font-sans" ref={containerRef}>
			<form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						className="w-full pl-9"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Rechercher..."
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery('')}
							className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				<Button type="submit" className="shrink-0 bg-orange text-zinc-900 hover:bg-orangehover">
					<Search className="h-4 w-4" />
				</Button>
			</form>

			{/* PREVISUALISATION RESULTATS */}
			{results.length > 0 && (
				<Card
					className={`z-50 mt-2 max-h-[60vh] w-full overflow-hidden overflow-y-auto text-left shadow-xl ${props.home ? ' absolute' : ''}`}>
					<ul>
						{results.map((item, index) => (
							<li key={index} className="border-b last:border-0">
								<Link
									href={`/product/${item.id}`}
									className="flex cursor-pointer gap-4 p-4 transition-colors hover:bg-muted/50">
									<div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white">
										<img
											src={Array.isArray(item.picture) ? item.picture[0]?.url : item.picture || '/placeholder.png'}
											alt={item.name}
											className="h-full w-full object-contain"
											onError={(e) => (e.target.src = '/placeholder.png')}
										/>
									</div>
									<div className="flex min-w-0 flex-1 flex-col justify-between">
										<div>
											<p className="truncate text-sm font-semibold">{item.name}</p>
											<p className="truncate text-xs capitalize text-muted-foreground">
												{item.brand} • {item.categorie}
											</p>
										</div>
										<div className="mt-1 flex items-center justify-between">
											<span className="font-bold text-primary">{item.priceMoy} €</span>
										</div>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Card>
			)}
		</div>
	);
}
