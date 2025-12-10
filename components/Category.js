import {Button} from '@/components/ui/button';

function Category() {
	return (
		<>
			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
				<section>
					<Button className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm">Category</Button>
				</section>
			</main>
		</>
	);
}

export default Category;
