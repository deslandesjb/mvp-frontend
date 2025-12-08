import {Button} from '@/components/ui/button';
import {ArrowLeft, Menu, X} from 'lucide-react';
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
	return (
		<header className="flex h-16 items-center justify-between px-4 font-title shadow-lg">
			<div className="min-w-80">
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
								<DrawerDescription>Main menu</DrawerDescription>
							</DrawerHeader>
							<div className="flex h-screen flex-col">
								<DrawerClose className="mr-4 h-16 w-fit self-end">
									<X />
								</DrawerClose>
								<nav className="flex h-full flex-col items-center justify-center gap-4">
									<Link className="lowercase first-letter:uppercase" href="#">
										test
									</Link>
									<Link className="lowercase first-letter:uppercase" href="#">
										test
									</Link>
									{/* NESTED */}
									<Drawer direction="right">
										<DrawerTrigger className="lowercase first-letter:uppercase">All categories</DrawerTrigger>
										<DrawerContent>
											<DrawerHeader>
												<DrawerTitle>Logo</DrawerTitle>
												<DrawerDescription>Second menu</DrawerDescription>
											</DrawerHeader>
											<div className="flex h-screen flex-col">
												<DrawerClose className="mr-4 h-16 w-fit self-end">
													<ArrowLeft />
												</DrawerClose>
												<nav className="flex h-full flex-col items-center justify-center gap-4">
													<Link className="lowercase first-letter:uppercase" href="#">
														test
													</Link>
													<Link className="lowercase first-letter:uppercase" href="#">
														test
													</Link>
												</nav>
											</div>
										</DrawerContent>
									</Drawer>
								</nav>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
				{/* desktop */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="flex-wrap gap-4">
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent p-0 text-base font-normal">
								All categories
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-2 p-4 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
											<a
												className="bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md from-muted/50 to-muted p-4 no-underline transition-all duration-200 focus:shadow-md md:p-6"
												href="/">
												<div className="mb-2 text-lg font-medium sm:mt-4">shadcn/ui</div>
												<p className="text-sm leading-tight text-muted-foreground">
													Beautifully designed components built with Tailwind CSS.
												</p>
											</a>
										</NavigationMenuLink>
									</li>
									<li className="flex flex-col gap-2">
										<Link href="#" className="inline-block">
											Test
										</Link>
										<Link href="#" className="inline-block">
											Test
										</Link>
										<Link href="#" className="inline-block">
											Test
										</Link>
										<Link href="#" className="inline-block">
											Test
										</Link>
										<Link href="#" className="inline-block">
											Test
										</Link>
									</li>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="#">Test</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink asChild>
								<Link href="#">Test</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex min-w-80 justify-end">
				<Link href="#">Connexion</Link>
			</div>
		</header>
	);
}
