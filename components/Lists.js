import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {BadgeMinus, Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Connexion from '../components/Connexion';
import ProductCard from './ProductCard';

function List() {
	const token = useSelector((state) => state.user.token);
	console.log(token);
	// ${user.token}
	const [listsData, setListsData] = useState([]);
	const [nameList, setNameList] = useState('');
	const [idList, setIdList] = useState('');

	const allLists = () => {
		token &&
			fetch(`http://localhost:3000/lists/${token}`)
				.then((response) => response.json())
				.then((listsUser) => {
					setListsData(listsUser);
				});
	};
	useEffect(() => {
		allLists();
	}, []);

	const nameListRegister = () => {
		token &&
			fetch(`http://localhost:3000/lists/newLists/${token}`, {
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
		fetch(`http://localhost:3000/lists/removeList/${idList}`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
		})
			.then((response) => response.json())
			.then(() => {
				// console.log('newList', newList)
				allLists();
			});
	};

	const list = listsData?.listsUser?.map((listUser) => {
		console.log('listUser', listUser.idProducts);

		return (
			<>
				<Accordion type="single" collapsible className="mt-10 w-full" defaultValue="item-1">
					<AccordionItem value="item-1" className="w-full">
						<AccordionTrigger className="rounded-lg bg-orange pl-4 pr-4 text-white hover:bg-orangehover">
							{listUser.name}
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-4 text-balance">
							<div className="mt-10 w-full" key={listUser._id}>
								<Button onClick={() => deleteList(listUser._id)}>
									<BadgeMinus />
								</Button>
							</div>
							{listUser.products.map((product) => {
								return (
									<ProductCard
										name={product.name}
										id={product._id}
										picture={product.picture}
										desc={product.desc}
										priceMoy={product.priceMoy}
										stars={product.stars}
										listNames={listsData.listsUser}
									/>
								);
							})}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</>
		);
	});

	return (
		<>
			{/* {list} */}
			<main className="min-h-screen-header flex flex-col justify-center font-body">
				<section className="h-full w-full p-20">
					<div>
						<h3 className="text-4xl">Favoris</h3>
						<Popover>
							<PopoverTrigger>
								<Button className="mt-10 bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm">
									<Plus className="fill-darkblue" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="center" sideOffset={50} className="flex">
								{token ? (
									<>
										<input
											type="text"
											placeholder="Nom"
											className="mr-10 p-2"
											onChange={(e) => setNameList(e.target.value)}
										/>
										<Button type="button" onClick={nameListRegister}>
											valider
										</Button>
									</>
								) : (
									<Connexion></Connexion>
								)}
							</PopoverContent>
						</Popover>
					</div>
					{list}
				</section>
			</main>
		</>
	);
}

export default List;
