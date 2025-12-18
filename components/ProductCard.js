import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Minus, Plus, Star} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import Inscription from '../components/Inscription';

import {useState} from 'react';
import {toast} from 'sonner';

function ProductCard(props) {
	const token = useSelector((state) => state.user.token);
	const [removed, setRemoved] = useState(Boolean);

	const addToList = (idProduct, idList, nameProduct, nameList) => {
		// console.log("token", token)
		// console.log("idProduct", idProduct)
		// console.log("idList", idList)
		token &&
			fetch(`https://mvp-backend-seven.vercel.app/lists/addToLists/${token}/${idProduct}/${idList}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
			})
				.then((response) => response.json())
				.then((resultat) => {
					console.log(resultat);
					console.log(nameProduct);
					console.log(nameList);
					props.allLists();
					setRemoved(resultat.remove);

					const message = resultat.remove
						? `Vous avez enlevé le produit ${nameProduct.slice(0, 10)}...  de la list : ${nameList} `
						: `Vous avez ajouté le produit ${nameProduct.slice(0, 10)} à la list :  ${nameList}`;

					notif(message);
				});
	};

	const notif = (message) => {
		toast(message, {
			// description: "Modification de la list",
			action: {
				label: 'Fermer',
				// onClick: () => console.log("Undo"),
			},
		});
	};

	const stars = [];
	for (let i = 0; i < 5; i++) {
		let starClass = ' stroke-zinc-900';
		if (i < props.noteMoy - 1) {
			starClass += ' fill-orange';
		}
		stars.push(<Star key={i} strokeWidth={1} size={18} className={starClass} />);
	}
	return (
		<Card className="min-w-7xl z-10 w-full max-w-xl overflow-hidden bg-white hover:shadow-lg md:w-[calc((100%-2rem)/2)] xl:w-[calc((100%-4rem)/3)]">
			<div className="relative flex h-full">
				<DropdownMenu>
					<DropdownMenuTrigger className="absolute right-0 top-0 z-10 px-4 py-2">
						<Plus size={18} />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="z-10">
						<DropdownMenuLabel>My Lists</DropdownMenuLabel>
						{token ? (
							props.listNames.map((name, i) => {
								const productExists = name.products.some((product) => product?.id === props.id);
								return (
									<div key={i}>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="justify-between">
											{name.name}
											<Button
												className="bg-transparent hover:bg-transparent"
												variant="outline"
												onClick={() => {
													addToList(props.id, name._id, props.name, name.name);
													notif();
												}}>
												{!productExists ? <Plus color="darkblue" /> : <Minus color="orange" />}
											</Button>
										</DropdownMenuItem>
									</div>
								);
							})
						) : (
							<Inscription card={true} />
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<Link href={'/product/' + props.id} className="relative flex h-full flex-col items-center lg:flex-row">
					<CardContent className="w-1/2 p-0">
						<div>
							<Image
								className="h-full w-full"
								src={props.picture[0].url}
								alt={props.picture[0].title}
								width={200}
								height={200}
							/>
						</div>
					</CardContent>
					<div className="w-full lg:w-1/2">
						<CardHeader>
							<CardTitle className="text-sm">{props.name.slice(0, 25) + '...'}</CardTitle>
							<CardDescription>{props.desc}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex">{stars}</div>
							<div className="flex justify-between">
								<p className="font-bold">{props.priceMoy}€</p>
							</div>
						</CardContent>
					</div>
				</Link>
			</div>
		</Card>
	);
}

export default ProductCard;
