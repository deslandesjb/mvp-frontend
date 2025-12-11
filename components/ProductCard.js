import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


function ProductCard(props) {
	const stars = [];
	for (let i = 0; i < 5; i++) {
		let starClass = ' stroke-zinc-900';
		if (i < props.noteMoy - 1) {
			starClass += ' fill-orange';
		}
		stars.push(<Star key={i} strokeWidth={1} size={18} className={starClass} />);
	}
	return (
		<Card className="w-[450px] min-w-64 overflow-hidden hover:shadow-lg m-5">
			<Link href={'products/' + props.id} className="inline-block h-full flex relative">
				<DropdownMenu>
					<DropdownMenuTrigger className="absolute right-0 top-0 z-10">
						<Button variant="ghost">
							<Plus size={18} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Accouyarnnt</DropdownMenuLabel>
						{props.listNames.map((name) => {
							return (
								<React.Fragment key={name.name}>

									<DropdownMenuSeparator />
									<DropdownMenuItem>{name.name}</DropdownMenuItem>
								</React.Fragment>
							)
						})}
					</DropdownMenuContent>
				</DropdownMenu>
				<CardContent>
					<div className='w-[200px]'>
						<Image className="p-8 w-[100%] h-[100%]" src={props.picture[0].url} alt={props.picture[0].title} width={200} height={200} />

					</div>
				</CardContent>
				<div>
					<CardHeader>
						<CardTitle className='text-sm'>{props.name.slice(0, 25) + '...'}</CardTitle>
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
		</Card>
	);
}

export default ProductCard;
