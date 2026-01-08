import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Check, SlidersHorizontal} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function FilterPanel() {
	const router = useRouter();

	const [categories, setCategories] = useState([]); // Catégories
	const [brands, setBrands] = useState([]); // brands
	const [filters, setFilters] = useState({
		categories: [],
		brands: [],
		minPrice: '',
		maxPrice: '',
	});

	useEffect(() => {
		// fetch('https://mvp-backend-seven.vercel.app/products/categories')
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => data.result && setCategories(data.categories));
	}, []);

	useEffect(() => {
		fetch('http://localhost:3000/products/brands')
			.then((response) => response.json())
			.then((data) => data.result && setBrands(data.brands));
	}, []);

	// --- HANDLERS UI ---
	const handleSelectFilter = (field, value) => {
		// On récupère la liste actuelle (ex: categories ou brands)
		const currentList = filters[field];
		let newList = [];

		// Si l'élément est déjà coché, on le retire
		if (currentList.includes(value)) {
			newList = currentList.filter((item) => item !== value);
		} else {
			// Sinon, on l'ajoute à la liste
			newList = [...currentList, value];
		}

		// On met à jour l'état global
		setFilters({...filters, [field]: newList});
	};

	const handlePriceChange = (field, value) => {
		setFilters({...filters, [field]: value});
	};

	// Calcul du nombre de filtres actifs
	const activeCount =
		filters.categories.length + filters.brands.length + (filters.minPrice || filters.maxPrice ? 1 : 0);

	// --- REDIRECTION VERS HOME ---
	const handleApplyFilters = () => {
		const params = new URLSearchParams();
		if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
		if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
		if (filters.minPrice) params.append('minPrice', filters.minPrice);
		if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

		router.push(`/?${params.toString()}`);
	};

	// --- RENDER ---
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={`relative flex h-10 shrink-0 items-center justify-center rounded-md border border-orange bg-orange px-3 text-sm font-medium ring-offset-background transition-colors hover:border-orangehover hover:bg-orangehover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeCount > 0 ? 'border-solid border-orangehover bg-orangehover text-primary' : ''}`}>
				<SlidersHorizontal className="mr-2 h-4 w-4" />
				<span className="hidden sm:inline">Filtres</span>
				{activeCount > 0 && (
					<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
						{activeCount}
					</span>
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-[90vw] max-w-[400px] p-0" align="start">
				<Card className="border-0 shadow-none">
					<CardHeader className="pb-4">
						<CardTitle>Filtres</CardTitle>
					</CardHeader>
					<CardContent className="grid max-h-[60vh] gap-6 overflow-y-auto">
						{/* CATÉGORIES */}
						<div>
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Catégories</h4>
							<div className="grid grid-cols-2 gap-2">
								{categories.map((cat) => (
									<div
										key={cat}
										onClick={() => handleSelectFilter('categories', cat)}
										className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 transition-colors ${filters.categories.includes(cat) ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}>
										<div
											className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${filters.categories.includes(cat) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
											{filters.categories.includes(cat) && <Check className="h-3 w-3 text-white" />}
										</div>
										<span className="truncate text-sm">{cat}</span>
									</div>
								))}
							</div>
						</div>

						{/* MARQUES */}
						<div>
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Marques</h4>
							<div className="flex flex-wrap gap-2">
								{brands.map((brand) => (
									<button
										key={brand}
										type="button"
										onClick={() => handleSelectFilter('brands', brand)}
										className={`rounded-md border px-3 py-1 text-xs transition-all ${filters.brands.includes(brand) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted'}`}>
										{brand}
									</button>
								))}
							</div>
						</div>

						{/* BUDGET */}
						<div className="pb-2">
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</h4>
							<div className="flex items-center gap-2">
								<div className="relative flex-1">
									<span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Min</span>
									<Input
										type="number"
										className="h-9 pl-9"
										value={filters.minPrice}
										onChange={(e) => handlePriceChange('minPrice', e.target.value)}
									/>
								</div>
								<span className="text-muted-foreground">-</span>
								<div className="relative flex-1">
									<span className="absolute left-2 top-2.5 text-xs text-muted-foreground">Max</span>
									<Input
										type="number"
										className="h-9 pl-9"
										value={filters.maxPrice}
										onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
									/>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-between border-t pt-4">
						<button
							type="button"
							onClick={() =>
								setFilters({
									categories: [],
									brands: [],
									minPrice: '',
									maxPrice: '',
								})
							}
							className="text-xs text-muted-foreground underline transition-colors hover:text-red-500">
							Tout effacer
						</button>
						{/*  */}
						<DropdownMenuItem asChild>
							<Button size="sm" onClick={handleApplyFilters} className="w-auto cursor-pointer">
								Voir les résultats
							</Button>
						</DropdownMenuItem>
					</CardFooter>
				</Card>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
