// import styles from '../styles/Home.module.css';
import {Button} from '@/components/ui/button';

function Home() {
	return (
		<>
			<main className="font-body flex h-screen flex-col items-center justify-center">
				<section>
					<h1 className="italic">
						Welcome to <a href="https://nextjs.org">Next.js!</a>
					</h1>
				</section>

				<section>
					<Button className="hover:bg-orangehover bg-orange text-zinc-900">Shadcn component</Button>
				</section>
			</main>
		</>
	);
}

export default Home;
