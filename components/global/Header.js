import {useWindowSize} from '@uidotdev/usehooks';
import {LogOut, Menu, Search, User, X} from 'lucide-react'; // Ajout de LogOut et User
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../reducer/user';

import Connexion from '../Connexion';
import Inscription from '../Inscription';
import SearchInput from '../Search';

import {Drawer, DrawerClose, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';

export default function Header() {
	const [categories, setCategories] = useState([]);
	const size = useWindowSize();
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchRef = useRef(null);

	// Fermer la recherche au clic extérieur
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsSearchOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => {
				if (data.result) setCategories(data.categories);
			})
			.catch((error) => console.error('Erreur chargement catégories:', error));
	}, []);

	const handleLogout = () => {
		dispatch(logout());
		router.push('/');
	};

	const catShow = categories.map((data, i) => {
		if (size.width >= 768) {
			return (
				<NavigationMenuLink key={i} asChild>
					<Link href={`/allproducts?categories=${data}`}>
						<div className="first-letter:uppercase hover:text-orange">{data}</div>
					</Link>
				</NavigationMenuLink>
			);
		} else {
			return (
				<Link key={i} href={`/allproducts?categories=${data}`} className="block py-2 first-letter:uppercase">
					{data}
				</Link>
			);
		}
	});

	return (
		<header className="relative z-50 flex h-16 items-center justify-between bg-zinc-100 px-4 font-title shadow-lg">
			{/* 1. GAUCHE : LOGO */}
			<div className="flex items-center md:min-w-60">
				<Link href="/" className="text-xl font-bold">
					LOGO
				</Link>
			</div>

			{/* 2. CENTRE : NAVIGATION */}
			<div>
				{/* --- MOBILE NAV (DRAWER) --- */}
				<div className="md:hidden">
					<Drawer direction="right">
						<DrawerTrigger>
							<Menu className="h-6 w-6" />
						</DrawerTrigger>

						<DrawerContent>
							<div className="flex h-screen flex-col p-4">
								<DrawerClose className="mb-2 self-end p-2">
									<X className="h-6 w-6" />
								</DrawerClose>

								<nav className="flex flex-col gap-2 overflow-y-auto">
									{/* Recherche Mobile */}
									<Accordion type="single" collapsible className="mb-4 w-full">
										<AccordionItem value="search-item" className="border-b-0">
											<AccordionTrigger className="py-3 text-xl font-normal hover:no-underline">
												<div className="flex items-center gap-3">
													<Search className="h-5 w-5" />
													Rechercher
												</div>
											</AccordionTrigger>
											<AccordionContent className="px-1 pb-4 pt-2">
												<SearchInput />
											</AccordionContent>
										</AccordionItem>

										<AccordionItem value="categories-item" className="border-b">
											<AccordionTrigger className="py-3 text-xl font-normal hover:no-underline">
												Catégories
											</AccordionTrigger>
											<AccordionContent className="flex flex-col gap-3 pl-4 text-base text-gray-600">
												{catShow}
											</AccordionContent>
										</AccordionItem>
									</Accordion>

									{/* <Link href="#" className="font-semibold text-xl py-2">TOP</Link> */}
									<Link href="/allproducts" className="py-2 text-xl font-semibold">
										Tous les produits
									</Link>
									<Link href="/lists" className="py-2 text-xl font-semibold">
										Favoris
									</Link>

									<div className="my-6 h-px bg-gray-200"></div>

									{!user.token && (
										<div className="flex flex-col gap-4">
											<Connexion />
											<Inscription />
										</div>
									)}

									{/* LOGOUT MOBILE (MINIMALISTE ET ALIGNÉ) */}
									{user.token && (
										<div className="mt-2 flex flex-col gap-4">
											<div className="flex items-center gap-3 px-1 text-gray-600">
												<User className="h-5 w-5" />
												<span className="text-lg">Bonjour {user.firstname}</span>
											</div>
											<button
												onClick={handleLogout}
												className="flex items-center gap-3 px-1 py-2 text-left text-xl font-normal text-gray-500 transition-colors hover:text-red-600">
												<LogOut className="h-5 w-5" />
												Déconnexion
											</button>
										</div>
									)}
								</nav>
							</div>
						</DrawerContent>
					</Drawer>
				</div>

				{/* --- DESKTOP NAV --- */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="flex-wrap gap-4">
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent px-3 py-2 text-base font-normal hover:bg-transparent hover:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
								<Link className="flex items-center gap-2" href="/allproducts">
									<Search className="h-4 w-4" />
									Rechercher
								</Link>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="relative flex w-[400px] flex-col gap-3 p-4">
									<p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Que cherchez-vous ?</p>
									<SearchInput />
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent px-3 py-2 text-base font-normal hover:bg-transparent hover:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
								<Link href="/allproducts">All categories</Link>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[400px] gap-3 p-4">
									{catShow}
									<div className="mt-2 border-t pt-2">
										<Link href="/allproducts" className="block text-sm font-bold text-orange hover:underline">
											Voir tout le catalogue →
										</Link>
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="/lists" className="px-3 py-2 transition-colors hover:text-orange">
									Favoris
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			{/* 3. DROITE : AUTHENTIFICATION (DESKTOP) */}
			<div className="hidden min-w-60 items-center justify-end gap-6 md:flex">
				{!user.token && (
					<>
						<Connexion />
						<Inscription />
					</>
				)}

				{/* --- LOGOUT DESKTOP MINIMALISTE --- */}
				{user.token && (
					<div className="flex items-center gap-4">
						<div className="flex flex-col items-end text-sm">
							<span className="text-xs text-gray-500">Bonjour</span>
							<span className="font-semibold text-gray-800">{user.firstname}</span>
						</div>
						<div className="mx-1 h-8 w-px bg-gray-300"></div> {/* Petit séparateur vertical */}
						<button
							onClick={handleLogout}
							className="group flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all hover:text-orange"
							title="Se déconnecter">
							<LogOut className="h-5 w-5" />
							<span className="text-sm font-medium decoration-orange underline-offset-4 group-hover:underline">
								Déconnexion
							</span>
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
