
import { useWindowSize } from '@uidotdev/usehooks';
import { Menu, X, Search, LogOut, User } from 'lucide-react'; // Ajout de LogOut et User
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducer/user';

import Connexion from '../Connexion';
import Inscription from '../Inscription';
import SearchInput from '../SearchInput';

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
                        <div className="first-letter:uppercase">{data}</div>
                    </Link>
                </NavigationMenuLink>
            );
        } else {
            return (
                <Link key={i} href={`/allproducts?categories=${data}`} className="first-letter:uppercase py-2 block">
                    {data}
                </Link>
            );
        }
    });

    return (
        <header className="relative z-50 flex h-16 items-center justify-between bg-zinc-100 px-4 font-title shadow-lg">
            
            {/* 1. GAUCHE : LOGO */}
            <div className="flex items-center md:min-w-60">
                <Link href="/" className="text-xl font-bold">LOGO</Link>
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
                            <div className="flex h-screen flex-col p-4 bg-white">
                                <DrawerClose className="mb-2 self-end p-2">
                                    <X className="h-6 w-6" />
                                </DrawerClose>

                                <nav className="flex flex-col gap-2 overflow-y-auto">
                                    {/* Recherche Mobile */}
                                    <Accordion type="single" collapsible className="w-full mb-4">
                                        <AccordionItem value="search-item" className="border-b-0">
                                            <AccordionTrigger className="text-xl font-normal hover:no-underline py-3">
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
                                            <AccordionTrigger className="text-xl font-normal hover:no-underline py-3">
                                                Catégories
                                            </AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-3 pl-4 text-base text-gray-600">
                                                {catShow}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    <Link href="#" className="font-semibold text-xl py-2">TOP</Link>
                                    <Link href="/allproducts" className="font-semibold text-xl py-2">Tous les produits</Link>
                                    <Link href="/lists" className="font-semibold text-xl py-2">Favoris</Link>

                                    <div className="my-6 h-px bg-gray-200"></div>

                                    {!user.token && (
                                        <div className="flex flex-col gap-4">
                                            <Connexion />
                                            <Inscription />
                                        </div>
                                    )}

                                    {/* LOGOUT MOBILE (MINIMALISTE ET ALIGNÉ) */}
                                    {user.token && (
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div className="flex items-center gap-3 text-gray-600 px-1">
                                                <User className="h-5 w-5" />
                                                <span className="text-lg">Bonjour {user.firstname}</span>
                                            </div>
                                            <button 
                                                onClick={handleLogout} 
                                                className="flex items-center gap-3 px-1 py-2 text-xl font-normal text-gray-500 hover:text-red-600 transition-colors text-left"
                                            >
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
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-3 py-2 hover:text-orange transition-colors">TOP</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <div className="relative" ref={searchRef}>
                                <button 
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 transition-colors ${isSearchOpen ? 'text-orange font-medium' : 'hover:text-orange'}`}
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Rechercher</span>
                                </button>
                                {isSearchOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[450px] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Que cherchez-vous ?</p>
                                            <SearchInput />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent text-base font-normal hover:bg-transparent hover:text-orange px-3 py-2 data-[state=open]:bg-transparent data-[state=open]:text-orange">
                                All categories
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid w-[400px] gap-3 p-4 bg-white">
                                    {catShow}
                                    <div className="mt-2 pt-2 border-t">
                                        <Link href="/allproducts" className="block font-bold text-orange hover:underline text-sm">
                                            Voir tout le catalogue →
                                        </Link>
                                    </div>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/lists" className="px-3 py-2 hover:text-orange transition-colors">Favoris</Link>
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
                            <span className="text-gray-500 text-xs">Bonjour</span>
                            <span className="font-semibold text-gray-800">{user.firstname}</span>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-300 mx-1"></div> {/* Petit séparateur vertical */}

                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 rounded-full px-3 py-2 text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
                            title="Se déconnecter"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-medium group-hover:underline decoration-red-600 underline-offset-4">
                                Déconnexion
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}