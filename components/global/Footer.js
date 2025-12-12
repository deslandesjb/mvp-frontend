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
		<footer className="flex h-28 items-center justify-between bg-darkblue p-16 font-title text-white shadow-lg">
			<div className="md:min-w-60">
				<Link href="/">logo</Link>
			</div>
			<div></div>
			<div></div>
		</footer>
	);
}
