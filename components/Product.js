import {Button} from '@/components/ui/button';

function Product() {
	return (
		<>
			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
				<section>
					<Button className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm">Product</Button>
				</section>
			</main>
		</>
	);
}

export default Product;
