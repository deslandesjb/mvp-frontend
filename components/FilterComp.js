// 'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ArrowDownNarrowWide, ArrowUpNarrowWide, Check, Minus, Plus, SlidersHorizontal, Star} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

// const ALL_CATEGORIES = ['Casque', 'Portable', 'Tablette', 'Ordinateur', 'Télévision'];

const ALL_BRANDS = [
	'Sony',
	'JBL',
	'Bose',
	'Marshall',
	'Avizar',
	'Samsung',
	'Blackview',
	'Générique / Reseller',
	'Xiaomi',
	'Acer',
	'HP',
	'Logicom',
	'Doogee',
	'Lenovo',
	'Shokz',
	'HyperX',
	'SteelSeries',
	'Microsoft',
	'Greed / Reseller',
	'Asus',
	'TCL',
	'Smart Tech',
	'Hisense',
	'Proline',
	'Thomson',
	'Philips',
	'Veidoo',
	'Archos',
	'Apple',
];

const AVAILABLE_SELLERS = ['Amazon', 'Darty', 'Fnac'];

export default function FilterPanel() {
	const [showFilters, setShowFilters] = useState(false);
	const [expandCats, setExpandCats] = useState(false);
	const [expandBrands, setExpandBrands] = useState(false);
	const [categories, setCategories] = useState([]); // Catégories

	useEffect(() => {
		fetch('https://mvp-backend-seven.vercel.app/products/categories')
			.then((response) => response.json())
			.then((data) => data.result && setCategories(data.categories));
	}, []);

	const [filters, setFilters] = useState({
		categories: [],
		brands: [],
		sellers: [],
		minPrice: '',
		maxPrice: '',
		sortBy: 'pertinence',
	});

	const router = useRouter();
	const filterRef = useRef(null);

	// --- HANDLERS UI ---
	const toggleFilterArray = (field, value) => {
		setFilters((prev) => {
			const list = prev[field];
			if (list.includes(value)) return {...prev, [field]: list.filter((item) => item !== value)};
			else return {...prev, [field]: [...list, value]};
		});
	};

	const handlePriceChange = (field, value) => setFilters((prev) => ({...prev, [field]: value}));
	const handleSortChange = (value) => setFilters((prev) => ({...prev, sortBy: value}));

	const activeCount =
		filters.categories.length +
		filters.brands.length +
		filters.sellers.length +
		(filters.minPrice || filters.maxPrice ? 1 : 0) +
		(filters.sortBy !== 'pertinence' ? 1 : 0);

	// --- REDIRECTION VERS HOME ---
	const handleApplyFilters = () => {
		const params = new URLSearchParams();
		if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
		if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
		if (filters.sellers.length > 0) params.append('sellers', filters.sellers.join(','));
		if (filters.minPrice) params.append('minPrice', filters.minPrice);
		if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
		if (filters.sortBy !== 'pertinence') params.append('sortBy', filters.sortBy);

		router.push(`/?${params.toString()}`);
		setShowFilters(false);
	};

	// --- RENDER ---
	return (
		<div className="relative" ref={filterRef}>
			<Button
				type="button"
				variant={showFilters ? 'secondary' : 'outline'}
				onClick={() => setShowFilters(!showFilters)}
				className={`relative shrink-0 border px-3 hover:border-orange hover:bg-orange ${activeCount > 0 ? 'border-solid border-orangehover bg-orangehover text-primary' : ''}`}>
				<SlidersHorizontal className="mr-2 h-4 w-4" />
				<span className="hidden sm:inline">Filtres</span>
				{activeCount > 0 && (
					<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
						{activeCount}
					</span>
				)}
			</Button>

			{/* MODAL FILTRES */}
			{showFilters && (
				<div className="absolute left-0 top-full z-50 mt-2 flex max-h-[60vh] w-[calc(100vw-2rem)] max-w-[400px] flex-col rounded-xl border bg-popover text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 sm:max-h-[500px] sm:w-[400px]">
					<div className="flex-1 space-y-6 overflow-y-auto p-5">
						{/* TRI */}
						<div>
							<h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Trier par</h4>
							<div className="flex flex-wrap gap-2">
								{[
									{label: 'Pertinence', val: 'pertinence', icon: null},
									{label: '- Cher', val: 'price_asc', icon: ArrowDownNarrowWide},
									{label: '+ Cher', val: 'price_desc', icon: ArrowUpNarrowWide},
									{label: 'Notes', val: 'stars', icon: Star},
								].map((opt) => (
									<button
										key={opt.val}
										type="button"
										onClick={() => handleSortChange(opt.val)}
										className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all ${filters.sortBy === opt.val ? 'border-primary bg-primary font-medium text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
										{opt.icon && <opt.icon className="h-3 w-3" />}
										{opt.label}
									</button>
								))}
							</div>
						</div>

						{/* CATÉGORIES */}
						<div>
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Catégories</h4>
							<div className="grid grid-cols-2 gap-2">
								{(expandCats ? categories : categories.slice(0, 6)).map((cat) => (
									<div
										key={cat}
										onClick={() => toggleFilterArray('categories', cat)}
										className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 transition-colors ${filters.categories.includes(cat) ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}>
										<div
											className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${filters.categories.includes(cat) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
											{filters.categories.includes(cat) && <Check className="h-3 w-3 text-white" />}
										</div>
										<span className="truncate text-sm">{cat}</span>
									</div>
								))}
								<button
									type="button"
									onClick={() => setExpandCats(!expandCats)}
									className="col-span-2 mt-1 flex items-center justify-center gap-1 py-1 text-xs font-medium text-primary hover:underline">
									{expandCats ? (
										<>
											<Minus className="h-3 w-3" /> Moins
										</>
									) : (
										<>
											<Plus className="h-3 w-3" /> Voir plus
										</>
									)}
								</button>
							</div>
						</div>

						{/* MARQUES */}
						<div>
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Marques</h4>
							<div className="flex flex-wrap gap-2">
								{(expandBrands ? ALL_BRANDS : ALL_BRANDS.slice(0, 6)).map((brand) => (
									<button
										key={brand}
										type="button"
										onClick={() => toggleFilterArray('brands', brand)}
										className={`rounded-md border px-3 py-1 text-xs transition-all ${filters.brands.includes(brand) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted'}`}>
										{brand}
									</button>
								))}
								<button
									type="button"
									onClick={() => setExpandBrands(!expandBrands)}
									className="flex items-center rounded-full border border-dashed border-primary px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10">
									{expandBrands ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
								</button>
							</div>
						</div>

						{/* VENDEURS */}
						<div>
							<h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Vendeurs</h4>
							<div className="flex flex-wrap gap-2">
								{AVAILABLE_SELLERS.map((seller) => (
									<button
										key={seller}
										type="button"
										onClick={() => toggleFilterArray('sellers', seller)}
										className={`rounded-md border px-3 py-1 text-xs transition-all ${filters.sellers.includes(seller) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted'}`}>
										{seller}
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
					</div>

					<div className="flex shrink-0 items-center justify-between rounded-b-xl border-t bg-background p-4">
						<button
							type="button"
							onClick={() =>
								setFilters({
									categories: [],
									brands: [],
									sellers: [],
									minPrice: '',
									maxPrice: '',
									sortBy: 'pertinence',
								})
							}
							className="text-xs text-muted-foreground underline transition-colors hover:text-red-500">
							Tout effacer
						</button>
						<Button size="sm" onClick={handleApplyFilters}>
							Voir les résultats
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
