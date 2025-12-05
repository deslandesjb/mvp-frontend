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
		<header className="font-title flex h-16 items-center justify-between px-4">
			<div>
				<Link href="/">logo</Link>
			</div>
			<div>
				{/* mobile */}
				<Drawer direction="right">
					<DrawerTrigger>
						<Menu />
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Logo</DrawerTitle>
							{/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
						</DrawerHeader>
						<nav className="flex h-screen flex-col items-center">
							<DrawerClose>
								<Button variant="ghost">
									<X />
								</Button>
							</DrawerClose>
							<Link href="#">test</Link>
							<Link href="#">test</Link>
						</nav>
						{/* <DrawerFooter>
							<Button>Submit</Button>
						</DrawerFooter> */}
					</DrawerContent>
				</Drawer>
				<nav></nav>
				{/* desktop */}
				<nav>{/* <Link></Link> */}</nav>
			</div>
		</header>
	);
}
