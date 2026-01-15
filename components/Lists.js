import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Plus, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Connexion from '../components/Connexion';
import Inscription from '../components/Inscription';
import ProductCard from './ProductCard';

function List() {
	const token = useSelector((state) => state.user.token);
	// console.log(token);
	// ${user.token}
	const [listsData, setListsData] = useState([]);
	const [nameList, setNameList] = useState('');

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
	// const [idList, setIdList] = useState('');

	const allLists = (props) => {
		token &&
			fetch(`https://mvp-backend-seven.vercel.app/lists/${token}`)
				.then((response) => response.json())
				.then((listsUser) => {
					setListsData(listsUser);
					// setListsData(listsUser)
				});
	};
	useEffect(() => {
		allLists();
	}, []);

	const nameListRegister = () => {
		token &&
			fetch(`https://mvp-backend-seven.vercel.app/lists/newLists/${token}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: nameList,
				}),
			})
				.then((response) => response.json())
				.then((newList) => {
					// console.log('newList', newList)
					allLists();
				});
	};

	const deleteList = (idList) => {
		fetch(`https://mvp-backend-seven.vercel.app/lists/removeList/${idList}`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
		})
			.then((response) => response.json())
			.then(() => {
				allLists();
			});
	};

	// --- VUE : NON CONNECTÉ ---
	if (!token) {
		return (
			<main className="flex min-h-[80vh] flex-col items-center justify-center gap-6 p-4 font-body">
				<div className="flex max-w-md flex-col items-center text-center">
					<h2 className="mb-2 text-2xl font-bold text-darkblue">Vous n'êtes pas connecté</h2>
					<p className="mb-8 text-muted-foreground">
						Connectez-vous ou créez un compte pour gérer vos listes de favoris et retrouver vos produits préférés.
					</p>
					<div className="flex flex-col gap-4 rounded-xl bg-white p-6 sm:flex-row">
						<Button onClick={openLogin} className="bg-orange text-zinc-900 hover:bg-orangehover">
							Se connecter
						</Button>
						<Button variant="outline" onClick={openSignup}>
							Créer un compte
						</Button>
					</div>
					<div className="hidden">
						<Connexion isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} switchToSignup={openSignup} />
						<Inscription isOpen={isInscriptionOpen} onOpenChange={setIsInscriptionOpen} switchToLogin={openLogin} />
					</div>
				</div>
			</main>
		);
	}

	// --- VUE : CONNECTÉ ---
	return (
		<main className="-mt-16 flex min-h-screen flex-col items-center bg-slate-50 font-body">
			{/* HEADER */}
			<section className="flex h-72 w-full flex-col items-center justify-center bg-gradient-to-tr from-darkblue to-bgdarkblue pt-16 text-slate-100">
				<h1 className="font-title text-4xl uppercase tracking-tight">Mes Listes</h1>
				<p className="mt-2 opacity-80">Gérez vos collections de produits</p>
			</section>

			<section className="container mx-auto max-w-7xl p-6">
				{/* BARRE D'ACTION : CRÉER UNE LISTE */}
				<div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
					<h2 className="text-lg font-semibold text-zinc-800">Vos collections ({listsData?.listsUser?.length || 0})</h2>
					<Popover>
						<PopoverTrigger asChild>
							<Button className="gap-2 bg-orange text-zinc-900 hover:bg-orangehover">
								<Plus size={18} />
								<span className="font-medium">Nouvelle liste</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-80">
							<div className="grid gap-4">
								<div className="space-y-2">
									<h4 className="font-medium leading-none">Créer une liste</h4>
									<p className="text-sm text-muted-foreground">Donnez un nom à votre nouvelle liste.</p>
								</div>
								<div className="flex gap-2">
									<Input
										placeholder="Ex: Idées cadeaux..."
										value={nameList}
										onChange={(e) => setNameList(e.target.value)}
										className="h-9"
									/>
									<Button size="sm" onClick={nameListRegister}>
										OK
									</Button>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* LISTE DES ACCORDÉONS */}
				<div className="space-y-4">
					{listsData?.listsUser?.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<p>Vous n'avez aucune liste pour le moment.</p>
						</div>
					)}

					{listsData?.listsUser?.map((listUser, i) => (
						<Accordion
							type="single"
							collapsible
							defaultValue={i === 0 ? listUser._id : ''} // si 1er alors ouvert
							className="w-full overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-sm"
							key={listUser._id}>
							<AccordionItem value={listUser._id} className="border-0">
								<div className="relative w-full">
									<AccordionTrigger className="w-full px-6 py-4 pr-16 hover:bg-slate-50 hover:no-underline">
										<div className="flex items-center gap-3 text-left">
											<span className="text-lg font-semibold capitalize text-darkblue">{listUser.name}</span>
											<span className="text-orange-700 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange/20 px-2 text-xs font-bold">
												{listUser.products.length}
											</span>
										</div>
									</AccordionTrigger>

									{/* MODALE SUPPRESSION GÉRÉE PAR SHADCN */}
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
												title="Supprimer la liste">
												<Trash2 size={18} />
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Supprimer la liste</DialogTitle>
												<DialogDescription>
													Êtes-vous sûr de vouloir supprimer la liste "{listUser.name}" ? Cette action est irréversible.
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<DialogClose asChild>
													<Button variant="outline">Annuler</Button>
												</DialogClose>
												<DialogClose asChild>
													<Button variant="destructive" onClick={() => deleteList(listUser._id)}>
														Supprimer
													</Button>
												</DialogClose>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								<AccordionContent className="border-t bg-slate-50/50 px-6 py-6">
									{listUser.products.length > 0 ? (
										<div className="products-container flex flex-wrap justify-center gap-8 md:justify-start">
											{listUser.products.map((product, idx) => (
												<ProductCard
													key={idx}
													{...product}
													listNames={listsData?.listsUser || []}
													allLists={allLists}
												/>
											))}
										</div>
									) : (
										<p className="py-8 text-center text-sm italic text-muted-foreground">
											Cette liste est vide. Ajoutez des produits depuis la recherche !
										</p>
									)}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}
				</div>
			</section>
		</main>
	);
}

export default List;
