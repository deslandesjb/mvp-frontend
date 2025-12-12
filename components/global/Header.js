import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from '../../reducer/user';

import Connexion from '../Connexion';
import Inscription from '../Inscription';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from '@/components/ui/drawer';

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
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

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
        router.push("/");
    };

    const catShow = categories.map((data, i) => (
        <Link key={i} href={data} className="first-letter:uppercase">
            {data}
        </Link>
    ));

    const catShowDesk = categories.map((data, i) => (
        <NavigationMenuLink key={i} asChild>
            <Link href={data}>
                <div className="first-letter:uppercase">{data}</div>
            </Link>
        </NavigationMenuLink>
    ));

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
                                                <p className="text-sm text-gray-600">
                                                    Bonjour {user.firstname} !
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="text-red-500 text-xl font-semibold hover:text-red-600"
                                            >
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
                                    {catShowDesk}
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
            <div className="hidden min-w-60 justify-end gap-6 md:flex items-center">
                
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
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}