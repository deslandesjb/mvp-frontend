import SearchInput from './SearchInput';


function Home() {
    return (
       
        <main className="flex min-h-screen flex-col items-center pt-24 px-4 font-body bg-background">
     
            <section className="w-full flex justify-center">
                {/* Le composant SearchInput gère sa propre largeur max (max-w-2xl), 
                    donc ici on lui donne juste toute la largeur disponible */}
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
