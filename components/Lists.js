/**
 * ============================================================================
 * FICHIER : components/Lists.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant affiche toutes les listes de favoris d'un utilisateur.
 * C'est la page principale de gestion des wishlists.
 * 
 * RÔLE :
 * - Afficher les produits favoris de l'utilisateur
 * - Permettre la création de nouvelles listes
 * - Marquer une liste comme "terminée" (achetée)
 * - Supprimer des listes
 * 
 * FONCTIONNEMENT :
 * 1. Récupère le token utilisateur depuis Redux
 * 2. Charge les listes depuis l'API /lists/:token
 * 3. Affiche chaque liste dans un Accordion dépliable
 * 4. Permet les actions CRUD sur les listes
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks
 * - Redux : useSelector pour le state global
 * - Lucide React : Icônes (ListPlus, Check, Trash, Star, ChevronDown)
 * - shadcn/ui : Accordion, Button, Input, Label, Dialog, Drawer
 * - Sonner : Notifications toast
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Composants UI shadcn/ui
 * - Accordion : Panneau dépliable pour les listes
 * - Button : Boutons d'action
 * - Input/Label : Formulaire de création
 * - Dialog : Modal (desktop) pour création
 * - Drawer : Modal (mobile) pour création
 */
import {
Accordion, 
AccordionContent, 
AccordionItem, 
AccordionTrigger
} from '@/components/ui/accordion';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

import {
Dialog, 
DialogClose, 
DialogContent, 
DialogDescription, 
DialogHeader, 
DialogTitle, 
DialogTrigger
} from '@/components/ui/dialog';

import {
Drawer, 
DrawerClose, 
DrawerContent, 
DrawerDescription, 
DrawerFooter, 
DrawerHeader, 
DrawerTitle, 
DrawerTrigger
} from '@/components/ui/drawer';

/**
 * Sonner : Notifications toast
 */
import {toast} from 'sonner';

/**
 * Lucide React : Icônes
 * - ListPlus : Icône d'ajout de liste
 * - Check : Validation/confirmation
 * - Trash2 : Suppression
 * - Star : Notation
 * - ChevronDown : Indicateur dépliant
 */
import {Check, ChevronDown, ListPlus, Star, Trash2} from 'lucide-react';

/**
 * Next.js : Composant Image optimisé
 */
import Image from 'next/image';

/**
 * Next.js : Composant Link pour navigation
 */
import Link from 'next/link';

/**
 * React Hooks
 */
import {useEffect, useState} from 'react';

/**
 * Redux : useSelector pour lire le state
 */
import {useSelector} from 'react-redux';


// ============================================================================
// 2. COMPOSANT LISTS
// ============================================================================

export default function Lists() {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * listsData : Tableau contenant toutes les listes de l'utilisateur
 * listName : Nom de la nouvelle liste (formulaire)
 * listDesc : Description de la nouvelle liste (formulaire)
 * isDrawerOpen : État du drawer mobile
 */
const [listsData, setListsData] = useState([]);
const [listName, setListName] = useState('');
const [listDesc, setListDesc] = useState('');
const [isDrawerOpen, setIsDrawerOpen] = useState(false);


// ─────────────────────────────────────────────────────────────────────────
// 2.2 DONNÉES REDUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * userToken : Token unique de l'utilisateur connecté
 * Utilisé pour identifier l'utilisateur dans les appels API
 */
const userToken = useSelector((state) => state.user.value.token);


// ─────────────────────────────────────────────────────────────────────────
// 2.3 CHARGEMENT INITIAL DES LISTES
// ─────────────────────────────────────────────────────────────────────────
/**
 * useEffect : Charge les listes au montage du composant
 * 
 * APPEL API : GET /lists/:token
 * 
 * RÉPONSE ATTENDUE :
 * {
 *   result: true,
 *   lists: [...] // Tableau des listes avec leurs produits
 * }
 */
useEffect(() => {

fetch(`http://localhost:3000/lists/${userToken}`)
.then((response) => response.json())
.then((data) => {
if (data.result) {
setListsData(data.lists);
}
});

}, []);  // Tableau vide : ne s'exécute qu'au montage


// ─────────────────────────────────────────────────────────────────────────
// 2.4 FONCTION : CRÉER UNE NOUVELLE LISTE
// ─────────────────────────────────────────────────────────────────────────
/**
 * createList : Envoie une requête pour créer une nouvelle liste
 * 
 * APPEL API : POST /lists/newLists
 * 
 * BODY :
 * {
 *   name: string,       // Nom de la liste
 *   description: string, // Description
 *   userToken: string    // Token utilisateur
 * }
 * 
 * COMPORTEMENT :
 * 1. Vérifie que le nom n'est pas vide
 * 2. Envoie la requête
 * 3. Ajoute la nouvelle liste au state local
 * 4. Ferme le drawer/dialog
 * 5. Affiche un toast de confirmation
 */
const createList = () => {

// Validation : nom obligatoire
if (listName === '') {
return;
}

// Envoi de la requête
fetch('http://localhost:3000/lists/newLists', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
name: listName,
description: listDesc,
userToken: userToken
})
})
.then((response) => response.json())
.then((data) => {
if (data.result) {
// Ajoute la nouvelle liste au tableau
setListsData([...listsData, data.list]);
// Réinitialise les champs
setListName('');
setListDesc('');
// Ferme le drawer si ouvert
setIsDrawerOpen(false);
// Notification de succès
toast.success('Liste créée');
}
});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.5 FONCTION : MARQUER UNE LISTE COMME TERMINÉE
// ─────────────────────────────────────────────────────────────────────────
/**
 * doneList : Marque une liste comme "achetée/terminée"
 * 
 * PARAMÈTRE :
 * - id : L'ID MongoDB de la liste à modifier
 * 
 * APPEL API : POST /lists/listDone
 * 
 * COMPORTEMENT :
 * Met à jour le champ "done" de la liste à true
 */
const doneList = (id) => {

fetch('http://localhost:3000/lists/listDone', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({listId: id})
})
.then((response) => response.json())
.then((data) => {
if (data.result) {
// Met à jour localement le statut de la liste
setListsData(
listsData.map((list) => {
if (list._id === id) {
return {...list, done: true};
}
return list;
})
);
toast.success('Liste terminée');
}
});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.6 FONCTION : SUPPRIMER UNE LISTE
// ─────────────────────────────────────────────────────────────────────────
/**
 * deleteList : Supprime définitivement une liste
 * 
 * PARAMÈTRE :
 * - id : L'ID MongoDB de la liste à supprimer
 * 
 * APPEL API : DELETE /lists/removeList
 * 
 * COMPORTEMENT :
 * 1. Envoie la requête de suppression
 * 2. Retire la liste du state local
 * 3. Affiche un toast de confirmation
 */
const deleteList = (id) => {

fetch('http://localhost:3000/lists/removeList', {
method: 'DELETE',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({listId: id})
})
.then((response) => response.json())
.then((data) => {
if (data.result) {
// Filtre la liste supprimée
setListsData(listsData.filter((list) => list._id !== id));
toast.success('Liste supprimée');
}
});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.7 FONCTION : AFFICHAGE DES ÉTOILES
// ─────────────────────────────────────────────────────────────────────────
/**
 * starsShow : Génère un tableau de 5 étoiles selon la note
 * 
 * PARAMÈTRE :
 * - note : La note du produit (0-5)
 * 
 * RETOUR :
 * - Tableau de 5 composants Star
 */
const starsShow = (note) => {
const stars = [];

for (let i = 0; i < 5; i++) {
let starClass = 'stroke-zinc-900';

// Remplit l'étoile si l'index < note - 1
if (i < note - 1) {
starClass += ' fill-orange';
}

stars.push(
<Star key={i} strokeWidth={1} size={18} className={starClass} />
);
}

return stars;
};


// ─────────────────────────────────────────────────────────────────────────
// 2.8 GÉNÉRATION DES ACCORDÉONS DE LISTES
// ─────────────────────────────────────────────────────────────────────────
/**
 * listAccordion : Transforme les données en composants visuels
 * 
 * STRUCTURE :
 * Pour chaque liste :
 *   - AccordionItem (conteneur)
 *     - AccordionTrigger (en-tête cliquable)
 *     - AccordionContent (contenu dépliant)
 *       - Pour chaque produit : une carte avec image, infos, lien
 */
const listAccordion = listsData?.map((list, i) => (
<AccordionItem value={`item-${i + 1}`} key={i}>

{/* ─────────────────────────────────────────────────────────
    EN-TÊTE DE L'ACCORDÉON
    ───────────────────────────────────────────────────────── */}
<AccordionTrigger className="rounded-md bg-orange px-4 data-[state=open]:rounded-b-none">
<span className="flex items-center justify-between gap-4">
{/* Nom de la liste */}
{list.name}
{/* Badge nombre de produits */}
<span className="rounded-full bg-white px-4">{list.products?.length}</span>
{/* Bouton terminer (si pas déjà done) */}
{!list.done && (
<Check
className="hover:stroke-green-500"
onClick={(e) => {
e.stopPropagation(); // Empêche le toggle de l'accordéon
doneList(list._id);
}}
/>
)}
{/* Bouton supprimer */}
<Trash2
className="hover:stroke-red-600"
onClick={(e) => {
e.stopPropagation();
deleteList(list._id);
}}
/>
</span>
</AccordionTrigger>

{/* ─────────────────────────────────────────────────────────
    CONTENU DE L'ACCORDÉON
    ───────────────────────────────────────────────────────── */}
<AccordionContent className="rounded-b-md border-2 border-t-0 border-orange py-4">

{/* Vérifie s'il y a des produits */}
{list.products.length > 0 ? (
<>
{/* Grille des produits */}
{list.products.map((product, j) => (
<Link
href={`/product/${product._id}`}
key={j}
className="flex items-center gap-4 rounded-md p-2 hover:bg-slate-100"
>
{/* Image du produit */}
<Image
src={product.picture[0]?.url}
alt={product.picture[0]?.title}
width={100}
height={100}
/>

{/* Informations */}
<div className="flex w-full items-center justify-between">
<div>
<h2 className="font-bold">{product.name}</h2>
<p className="flex">{starsShow(product.noteMoy)}</p>
</div>
<p>{product.priceMoy}€</p>
</div>
</Link>
))}
</>
) : (
// Message si liste vide
<p className="text-center text-zinc-500">Aucun produit</p>
)}

</AccordionContent>
</AccordionItem>
));


// ─────────────────────────────────────────────────────────────────────────
// 2.9 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<main className="mt-16 min-h-screen px-4 font-body md:mt-32 md:px-16">

{/* ═══════════════════════════════════════════════════════════════
    TITRE + BOUTONS CRÉATION
    ═══════════════════════════════════════════════════════════════ */}
<div className="mb-4 flex items-center justify-between">
<h1 className="text-3xl font-bold">Mes listes</h1>

{/* ─────────────────────────────────────────────────────────
    DIALOG : Version Desktop (caché sur mobile)
    ───────────────────────────────────────────────────────── */}
<Dialog>
<DialogTrigger asChild>
<Button className="hidden bg-orange hover:bg-orangehover md:block">
<ListPlus className="mr-2 inline-block" /> Créer une liste
</Button>
</DialogTrigger>

<DialogContent>
<DialogHeader>
<DialogTitle>Créer une liste</DialogTitle>
<DialogDescription>
Créer une liste pour sauvegarder des produits
</DialogDescription>
</DialogHeader>

{/* Formulaire */}
<div>
<Label htmlFor="name">Nom *</Label>
<Input
id="name"
type="text"
placeholder="Nom de la liste"
onChange={(e) => setListName(e.target.value)}
value={listName}
/>
</div>
<div>
<Label htmlFor="description">Description</Label>
<Input
id="description"
type="text"
placeholder="Description de la liste"
onChange={(e) => setListDesc(e.target.value)}
value={listDesc}
/>
</div>

{/* Bouton de validation */}
<DialogClose>
<Button
className="w-full bg-orange hover:bg-orangehover"
onClick={() => createList()}
>
Créer
</Button>
</DialogClose>
</DialogContent>
</Dialog>


{/* ─────────────────────────────────────────────────────────
    DRAWER : Version Mobile (caché sur desktop)
    ───────────────────────────────────────────────────────── */}
<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
<DrawerTrigger asChild>
<Button className="bg-orange hover:bg-orangehover md:hidden">
<ListPlus className="mr-2 inline-block" /> Créer une liste
</Button>
</DrawerTrigger>

<DrawerContent>
<DrawerHeader>
<DrawerTitle>Créer une liste</DrawerTitle>
<DrawerDescription>
Créer une liste pour sauvegarder des produits
</DrawerDescription>
</DrawerHeader>

{/* Formulaire */}
<div className="px-4">
<Label htmlFor="name2">Nom *</Label>
<Input
id="name2"
type="text"
placeholder="Nom de la liste"
onChange={(e) => setListName(e.target.value)}
value={listName}
/>
</div>
<div className="px-4">
<Label htmlFor="description2">Description</Label>
<Input
id="description2"
type="text"
placeholder="Description de la liste"
onChange={(e) => setListDesc(e.target.value)}
value={listDesc}
/>
</div>

<DrawerFooter>
<Button
className="w-full bg-orange hover:bg-orangehover"
onClick={() => createList()}
>
Créer
</Button>
<DrawerClose>
<Button variant="outline" className="w-full">
Annuler
</Button>
</DrawerClose>
</DrawerFooter>
</DrawerContent>
</Drawer>
</div>


{/* ═══════════════════════════════════════════════════════════════
    ACCORDÉONS DES LISTES
    ═══════════════════════════════════════════════════════════════ */}
<Accordion type="single" collapsible className="flex flex-col gap-4">
{listAccordion}
</Accordion>

</main>
);
}
