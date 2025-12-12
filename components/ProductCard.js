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
import {Plus, Star} from 'lucide-react';
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
		<Card className="w-full max-w-xl overflow-hidden hover:shadow-lg md:w-[calc(50%-1rem)] xl:w-[calc(33.3%-1rem)]">
			<Link href={'products/' + props.id} className="relative flex h-full">
				<DropdownMenu>
					<DropdownMenuTrigger className="absolute right-0 top-0 z-10 px-4 py-2">
						<Plus size={18} />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						{props.listNames.map((name, i) => {
							return (
								<div key={i}>
									<DropdownMenuSeparator />
									<DropdownMenuItem>{name.name}</DropdownMenuItem>
								</div>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
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
				<div className="w-1/2">
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
		</Card>
	);
}

export default ProductCard;
