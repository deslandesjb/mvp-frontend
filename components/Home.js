import Filter from './FilterComp';
import SearchInput from './SearchComp';

function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center bg-background px-4 pt-24 font-body">
			<section className="flex w-full justify-center">
				{/* Le composant SearchInput gère sa propre largeur max (max-w-2xl),
				donc ici on lui donne juste toute la largeur disponible */}
				<Filter />
				<SearchInput />
			</section>

			<section className="mt-8 text-center">
				{/* Exemple de contenu en dessous si besoin */}
				{/* <h1 className="text-2xl font-bold text-muted-foreground">Bienvenue sur MVP Shop</h1> */}
			</section>
		</main>
	);
}

export default Home;
