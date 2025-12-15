import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {BadgeMinus, Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import ProductCard from './ProductCard';

function List() {
	const [listsData, setListsData] = useState([]);
	const [nameList, setNameList] = useState('');
	const allLists = () => {
		fetch('http://localhost:3000/lists/S_GecKwSKafozaCV0BfnpDYgTkh1nXwd')
			.then((response) => response.json())
			.then((listsUser) => {
				setListsData(listsUser);
			});
	};
	useEffect(() => {
		allLists();
	}, []);

	const list = listsData?.listsUser?.map((listUser) => {
		console.log('listUser', listUser);

		return (
			<div className="mt-10 w-full rounded-lg bg-lightblue" key={listUser._id}>
				<BadgeMinus />
				<h6 className="w-[10%] bg-orange p-10">{listUser.name}</h6>
				<div className="flex flex-wrap items-center">
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
				</div>
			</div>
		);
	});

	const nameListRegister = () => {
		fetch('http://localhost:3000/lists/newLists/S_GecKwSKafozaCV0BfnpDYgTkh1nXwd', {
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

	return (
		<>
			{/* {list} */}
			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
				<section className="h-full w-full p-20">
					<div>
						<h3 className="text-4xl">Favoris</h3>

						<Popover>
							<PopoverTrigger>
								<Button className="mt-10 bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm">
									<Plus />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="center" sideOffset={50} className="flex">
								<input
									type="text"
									placeholder="Nom"
									className="mr-10 p-2"
									onChange={(e) => setNameList(e.target.value)}
								/>
								<Button type="button" onClick={nameListRegister}>
									valider
								</Button>
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
