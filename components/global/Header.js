import {Button} from '@/components/ui/button';
import {useWindowSize} from '@uidotdev/usehooks';
import {ArrowLeft, Menu, X} from 'lucide-react';
import Link from 'next/link';
import {useEffect, useState} from 'react';

// drawer
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

export default function Header() {
	const [categories, setCategories] = useState([]);
	const size = useWindowSize();

	useEffect(() => {
		fetch('http://localhost:3000/products/categories')
			.then((response) => response.json())
			.then((data) => {
				// setArticlesData(data.articles.filter((data, i) => i > 0));
				if (data.result) {
					setCategories(data.categories);
				}
			});
	}, []);

	// categories mobile

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

	// categories desktop
	// const catShowDesk = categories.map((data, i) => {
	// 	return (
	// 	);
	// });

	return (
		<header className="flex h-16 items-center justify-between bg-zinc-100 px-4 font-title shadow-lg">
			<div className="md:min-w-60">
				<Link href="/">logo</Link>
			</div>
			<div>
				{/* mobile */}
				<div className="md:hidden">
					<Drawer direction="right">
						<DrawerTrigger>
							<Menu />
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader className="hidden">
								<DrawerTitle>Logo</DrawerTitle>
								<DrawerDescription>Main menu</DrawerDescription>
							</DrawerHeader>
							<div className="flex h-screen flex-col">
								<DrawerClose className="mr-4 h-16 w-fit self-end">
									<X />
								</DrawerClose>
								<nav className="flex h-full flex-col items-center justify-center gap-4">
									<Link href="#">TOP</Link>
									{/* NESTED */}
									{/* <Drawer direction="right">
										<DrawerTrigger>All categories</DrawerTrigger>
										<DrawerContent>
											<DrawerHeader className="hidden">
												<DrawerTitle>Logo</DrawerTitle>
												<DrawerDescription>Second menu</DrawerDescription>
											</DrawerHeader>
											<div className="flex h-screen flex-col">
												<DrawerClose className="mr-4 h-16 w-fit self-end">
													<ArrowLeft />
												</DrawerClose>
												<nav className="flex h-full flex-col items-center justify-center gap-4">{catShow}</nav>
											</div>
										</DrawerContent>
									</Drawer> */}
									{catShow}
									<NavigationMenuLink asChild>
										<Link href="/allproducts">
											<div className="first-letter:uppercase">All products</div>
											{/* <div className="text-muted-foreground">Browse all components in the library.</div> */}
										</Link>
									</NavigationMenuLink>

									<Link href="/lists">Favoris</Link>

									{/* TODO IF !LOGGED */}
									<div className="flex gap-4">
										<Link href="#">Connexion</Link>
										<Link href="#">Inscription</Link>
									</div>

									{/* TODO IF LOGGED */}
								</nav>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
				{/* desktop */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="flex-wrap gap-4">
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="#">TOP</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent p-0 text-base font-normal">
								All categories
								{/* <Link href="/allproducts">Categories</Link> */}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-[300px] gap-4 p-4">
									{catShow}
									<Link href="/allproducts" className="first-letter:uppercase">
										All products
									</Link>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="/lists">Favoris</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="/productpage">ppage</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			{/* TODO IF !LOGGED */}
			<div className="hidden min-w-60 justify-end gap-4 md:flex">
				<Link href="#">Connexion</Link>
				<Link href="#">Inscription</Link>
			</div>

			{/* TODO IF LOGGED */}
		</header>
	);
}
