import {Button} from '@/components/ui/button';
import {Menu, X} from 'lucide-react';
import Link from 'next/link';

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

export default function Header() {
	return (
		<header className="font-title flex h-16 items-center justify-between bg-lightblue px-4">
			<div>
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
							<DrawerHeader>
								<DrawerTitle>Logo</DrawerTitle>
							</DrawerHeader>
							<div className="flex h-screen flex-col">
								<DrawerClose className="mr-4 h-16 w-fit self-end">
									<X />
								</DrawerClose>
								<nav className="flex h-full flex-col items-center justify-center">
									<Link href="#">test</Link>
									<Link href="#">test</Link>
								</nav>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
				{/* desktop */}
				<nav className="hidden md:flex">
					<Link href="#">test1</Link>
					<Link href="#">test2</Link>
				</nav>
			</div>
		</header>
	);
}
