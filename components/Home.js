// import styles from '../styles/Home.module.css';
import {Button} from '@/components/ui/button';

function Home() {
	return (
		<>
			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
				
				{/* <section>
					<Button className="bg-orange text-zinc-900 shadow-sm hover:bg-orangehover hover:shadow-lg">
						Shadcn component
					</Button>
				</section> */}
			</main>
		</>
	);
}

export default Home;
// import { Button } from '@/components/ui/button';
// import { useSelector } from 'react-redux';
// import Link from 'next/link';

// function Home() {
// 	const user = useSelector((state) => state.user);

// 	return (
// 		<>
// 			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body p-8">

			

// 				{/* SECTION BOUTONS */}
// 				<section className="flex gap-4 flex-wrap justify-center">
// 					<Link href="/allproducts">
// 						<Button className="bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-lg px-8 py-6 text-lg">
// 							Voir tous les produits
// 						</Button>
// 					</Link>

// 					{user?.token && (
// 						<Link href="/lists">
// 							<Button className="bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:shadow-lg px-8 py-6 text-lg">
// 								Mes Favoris
// 							</Button>
// 						</Link>
// 					)}
// 				</section>

// 				{/* MESSAGE INVITATION À CRÉER UN COMPTE */}
// 				{!user?.token && (
// 					<section className="mt-12 p-6 bg-gray-100 rounded-lg max-w-md text-center">
// 						<p className="text-gray-700">
// 							Crée ton compte pour débloquer toutes les fonctionnalités !
// 						</p>
// 					</section>
// 				)}
// 			</main>
// 		</>
// 	);
// }

// export default Home;

