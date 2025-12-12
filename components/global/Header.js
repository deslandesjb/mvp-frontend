import {useWindowSize} from '@uidotdev/usehooks';
import {Menu, X} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../reducer/user';

import Connexion from '../Connexion';
import Inscription from '../Inscription';

import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger} from '@/components/ui/drawer';

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
	console.log(user);
	

	useEffect(() => {
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setCategories(data.categories);
				}
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
				// desktop
				<NavigationMenuLink key={i} asChild>
					<Link href={data}>
						<div className="first-letter:uppercase">{data}</div>
						{/* <div className="text-muted-foreground">Browse all components in the library.</div> */}
					</Link>
				</NavigationMenuLink>
			);
		} else {
			// mobile
			return (
				<Link key={i} href={data} className="first-letter:uppercase">
					{data}
				</Link>
			);
		}
	});

	return (
		<header className="flex h-16 items-center justify-between bg-zinc-100 px-4 font-title shadow-lg">
			{/* LEFT : LOGO */}
			<div className="md:min-w-60">
				<Link href="/">logo</Link>
			</div>

			{/* CENTER NAVIGATION */}
			<div>
				{/* MOBILE NAV */}
				<div className="md:hidden">
					<Drawer direction="right">
						<DrawerTrigger>
							<Menu />
						</DrawerTrigger>

						<DrawerContent>
							<div className="flex h-screen flex-col">
								<DrawerClose className="mr-4 h-16 w-fit self-end">
									<X />
								</DrawerClose>

								<nav className="flex h-full flex-col items-center justify-center gap-4 text-xl">
									<Link href="#">TOP</Link>
									{catShow}
									<Link href="/allproducts">allproducts</Link>
									<Link href="/lists">Favoris</Link>
									{/* MOBILE : PAS CONNECTÉ */}
									{!user.token && (
										<>
											<Connexion />
											<Inscription />
										</>
									)}

									{/* MOBILE : CONNECTÉ */}
									{user.token && (
										<>
											<div className="text-center">
												<p className="text-sm text-gray-600">Bonjour {user.firstname} !</p>
											</div>
											<button onClick={handleLogout} className="text-xl font-semibold text-red-500 hover:text-red-600">
												Déconnexion
											</button>
										</>
									)}
								</nav>
							</div>
						</DrawerContent>
					</Drawer>
				</div>

				{/* DESKTOP */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="flex-wrap gap-4">
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="#">TOP</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>

						{/* Catégories */}
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent p-0 text-base font-normal">
								All categories
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[300px] gap-4 p-4">
									{catShow}
									<NavigationMenuLink asChild>
										<Link href="/allproducts">
											<div className="first-letter:uppercase">All products</div>
											{/* <div className="text-muted-foreground">Browse all components in the library.</div> */}
										</Link>
									</NavigationMenuLink>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="/lists">Favoris</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			{/* RIGHT BUTTONS (DESKTOP) */}
			<div className="hidden min-w-60 items-center justify-end gap-6 md:flex">
				{/* SI PAS CONNECTÉ */}
				{!user.token && (
					<>
						<Connexion />
						<Inscription />
					</>
				)}

				{/* SI CONNECTÉ */}
				{user.token && (
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-700">
							Bonjour, <span className="font-semibold">{user.firstname}</span>
						</span>
						<button
							onClick={handleLogout}
							className="rounded-lg bg-red-500 px-2 py-2 font-semibold text-white transition-colors hover:bg-red-600">
							Déconnexion
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
