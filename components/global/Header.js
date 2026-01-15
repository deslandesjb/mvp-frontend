import {Button} from '@/components/ui/button'; // Import du bouton pour les triggers manuels
import {useWindowSize} from '@uidotdev/usehooks';
import {LogOut, Menu, Search, User, X} from 'lucide-react'; // Ajout de LogOut et User
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../reducer/user';

// GSAP animation
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import Connexion from '../Connexion';
import Inscription from '../Inscription';
import SearchComp from '../SearchComp';

import {Drawer, DrawerClose, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export default function Header() {
	const [categories, setCategories] = useState([]);
	const size = useWindowSize();
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	// --- GESTION DES MODALES AUTH ---
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);

	const openLogin = () => {
		setIsInscriptionOpen(false);
		setIsLoginOpen(true);
	};
	const openSignup = () => {
		setIsLoginOpen(false);
		setIsInscriptionOpen(true);
	};

	useEffect(() => {
		fetch('https://mvp-backend-seven.vercel.app/products/categories')
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
					<Link href={`/?categories=${data}`}>
						<div className="transition-colors first-letter:uppercase hover:text-orange">{data}</div>
					</Link>
				</NavigationMenuLink>
			);
		} else {
			return (
				<DrawerClose key={i} asChild>
					<Link href={`/?categories=${data}`} className="block pt-2 text-xl first-letter:uppercase">
						{data}
					</Link>
				</DrawerClose>
			);
		}
	});

	useGSAP(() => {
		gsap.fromTo(
			'header',
			{
				backgroundColor: 'rgba(255,255,255, 0)',
				color: '#ff7849',
			},
			{
				backgroundColor: 'rgba(255,255,255, 1)',
				color: '#000',
				scrub: 0.1,
				scrollTrigger: {
					start: 50,
					end: 100,
					toggleActions: 'play play play reverse',
				},
			},
		);
	}, []);

	return (
		<header className="header sticky top-0 z-50 flex h-16 items-center justify-between bg-transparent px-4 font-title text-orange shadow-lg">
			{/* 1. GAUCHE : LOGO */}
			{/* MODALES AUTHENTIFICATION (Rendues une seule fois ici) */}
			<div className="hidden">
				<Connexion isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} switchToSignup={openSignup} />
				<Inscription isOpen={isInscriptionOpen} onOpenChange={setIsInscriptionOpen} switchToLogin={openLogin} />
			</div>

			<div className="flex items-center md:min-w-60">
				<Link
					href="/"
					className="flex items-center bg-gradient-to-tr from-darkblue to-lightblue bg-clip-text font-title text-xl font-bold text-transparent">
					<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="atlasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="#1e3a8a" />
								<stop offset="100%" stopColor="#93c5fd" />
							</linearGradient>
						</defs>
						<g fill="none">
							<path
								d="m12 8.657l-3.652 8.264c-.118.263-.185.479-.447.479H5.483c-.344 0-.534-.098-.36-.479l5.894-13.53c.118-.226.196-.391.463-.391h1.044c.262 0 .334.165.463.39l5.893 13.526c.17.386-.025.484-.37.484h-2.412c-.262 0-.334-.216-.447-.479l-3.652-8.27z"
								fill="url(#atlasGradient)"
							/>
							<path className="fill-orange" d="m12.005 21l-2.412-4.63h4.741z" fill="url(#atlasGradient)" />
						</g>
					</svg>
					ATLAS<span className="bg-gradient-to-tr from-orange to-orangehover bg-clip-text tracking-tight">Loot</span>
				</Link>
			</div>

			{/* 2. CENTRE : NAVIGATION */}
			<div>
				{/* --- MOBILE NAV (DRAWER) --- */}
				<div className="lg:hidden">
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
									<div className="my-4">
										<SearchComp home={false} />
									</div>
									{catShow}

									<DrawerClose asChild>
										<Link href="/" className="pt-2 text-xl text-orange">
											Tous les produits
										</Link>
									</DrawerClose>
									<DrawerClose asChild>
										<Link href="/lists" className="pt-2 text-xl">
											Favoris
										</Link>
									</DrawerClose>

									<div className="my-6 h-px bg-gray-200"></div>

									{!user.token && (
										<div className="flex flex-col gap-4">
											<Button
												variant="ghost"
												onClick={openLogin}
												className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
												Me connecter
											</Button>
											<Button
												variant="ghost"
												onClick={openSignup}
												className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
												Créer un compte
											</Button>
										</div>
									)}

									{/* LOGOUT MOBILE (MINIMALISTE ET ALIGNÉ) */}
									{user.token && (
										<div className="mt-2 flex flex-col gap-4">
											<div className="flex items-center gap-3 px-1">
												<User className="h-5 w-5" />
												<span className="text-lg">Bonjour {user.firstname}</span>
											</div>
											<button
												onClick={handleLogout}
												className="flex items-center gap-3 px-1 py-2 text-left text-xl font-normal transition-colors hover:text-red-600">
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
				<NavigationMenu className="hidden lg:flex">
					<NavigationMenuList className="flex-wrap gap-4">
						<NavigationMenuItem>
							<NavigationMenuTrigger className="gap-2 bg-transparent px-3 text-base font-normal transition-colors hover:bg-transparent hover:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
								<Search className="h-4 w-4" />
								Rechercher
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="relative flex w-[400px] flex-col gap-3 p-4">
									<p className="mb-1 text-xs font-bold uppercase tracking-wider">Que cherchez-vous ?</p>
									<SearchComp home={false} />
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent px-3 text-base font-normal transition-colors hover:bg-transparent hover:text-orange active:text-orange data-[state=open]:bg-transparent data-[state=open]:text-orange">
								<Link href="/">All categories</Link>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[400px] gap-3 p-4">
									{catShow}
									<div className="mt-2 border-t pt-2">
										<Link href="/" className="block text-sm font-bold text-orange hover:underline">
											Voir tout le catalogue →
										</Link>
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="/lists" className="px-3 transition-colors hover:text-orange">
									Favoris
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			{/* 3. DROITE : AUTHENTIFICATION (DESKTOP) */}
			<div className="hidden min-w-60 items-center justify-end gap-6 lg:flex">
				{!user.token && (
					<>
						<Button
							variant="ghost"
							onClick={openLogin}
							className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
							Me connecter
						</Button>
						<Button
							variant="ghost"
							onClick={openSignup}
							className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
							Créer un compte
						</Button>
					</>
				)}

				{/* --- LOGOUT DESKTOP MINIMALISTE --- */}
				{user.token && (
					<div className="flex items-center gap-4">
						<div className="flex flex-col items-end text-sm">
							<span className="text-xs">Bonjour</span>
							<span className="font-semibold">{user.firstname}</span>
						</div>
						<div className="mx-1 h-8 w-px bg-gray-300"></div>
						<button
							onClick={handleLogout}
							className="group flex items-center gap-2 rounded-full px-3 text-gray-500 transition-colors hover:text-orange"
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
