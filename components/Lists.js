import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BadgeMinus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Connexion from '../components/Connexion';

import ProductCard from './ProductCard';

function List() {
	const token = useSelector((state) => state.user.token);
	console.log(token);
	// ${user.token}
	const [listsData, setListsData] = useState([]);
	const [nameList, setNameList] = useState('');
	const [idList, setIdList] = useState('');

	const allLists = (props) => {
		token &&
		fetch(`http://localhost:3000/lists/${token}`)
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
		fetch(`http://localhost:3000/lists/newLists/${token}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
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

	const deleteList = (idList, nameList) => {
		const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer la list : ${nameList} ?`);
		confirmed && fetch(`http://localhost:3000/lists/removeList/${idList}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then(() => {
				// console.log('newList', newList)
				allLists();
			});
	};

	const list = listsData?.listsUser?.map((listUser) => {
		// {setLengthList(listUser.products.length)}
		console.log('listUser', listUser.idProducts);
		
		return (
			<>
				<Accordion type="single" collapsible className="mt-10 w-full relative" defaultValue="item-1 ">
					<AccordionItem value="item-1" className="w-full">
						<AccordionTrigger className="rounded-t-lg bg-darkblue pl-4 pr-4 text-white">
							<div className='flex'>
								<h6 className='mr-[10px] flex items-center'>
									{listUser.name}
								</h6>
								<p className=' flex justify-center items-center bg-white text-black p-1 rounded-full w-7	h-7	'>
									{listUser.products.length}
								</p>
							</div>

							<div className="mt-10  absolute right-[5rem] top-[-2rem]" key={listUser._id}>
								<Button className="bg-transparent hover:bg-transparent" onClick={() => deleteList(listUser._id, listUser.name)}>
									<BadgeMinus />
								</Button>
							</div>
						</AccordionTrigger>
						<AccordionContent className="flex flex-wrap gap-4 text-balance p-8 bg-lightblue rounded-b-lg">
							{listUser.products.map((product) => {
								return (
									<ProductCard
										{...product}
										listNames={listsData?.listsUser || []}
										allLists={allLists}
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
			<main className="min-h-screen-header flex flex-col items-center pt-16 font-body">
				<section className="h-full w-full p-20">
					<div>
						<h3 className="text-4xl">Favoris</h3>
						<Popover>
							<PopoverTrigger>
								<Button className="mt-10 bg-darkblue text-zinc-900 shadow-lg hover:bg-lightblue hover:shadow-sm">
									<Plus color='lightblue' />
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

										<Button type="button" onClick={nameListRegister} >
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
