import AllProducts from './AllProducts';
import Filter from './FilterComp';
import SearchInput from './SearchComp';

function Home() {
	return (
		<>
			<main className="flex flex-col items-center bg-background px-4 pt-24 font-body">
				<section className="flex w-full justify-center">
					<Filter />
					<SearchInput />
				</section>
			</main>
			<AllProducts />
		</>
	);
}

export default Home;
