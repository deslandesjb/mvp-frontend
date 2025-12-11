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
		<Card className="w-[23%] min-w-64 overflow-hidden hover:shadow-lg">
			<Link href={'products/' + props.id} className="inline-block h-full">
				<CardContent className="relative">
					<Image className="p-8" src={props.picture[0].url} alt={props.picture[0].title} width={600} height={314} />

					<DropdownMenu>
						<DropdownMenuTrigger className="absolute right-0 top-0 z-10">
							<Button variant="ghost">
								<Plus size={18} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Accouyarnnt</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardContent>
				<CardHeader>
					<CardTitle>{props.name}</CardTitle>
					<CardDescription>{props.desc}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex">{stars}</div>
					<div className="flex justify-between">
						<p className="font-bold">{props.priceMoy}€</p>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

export default ProductCard;
