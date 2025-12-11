// import styles from '../styles/Home.module.css';
import {Button} from '@/components/ui/button';

function Home() {
	return (
		<>
			<main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
				<section>
					<h1 className="italic">
						Welcome to <a href="https://nextjs.org">Next.js!</a>
					</h1>
				</section>

				<section>
					<Button className="bg-orange text-zinc-900 shadow-sm hover:bg-orangehover hover:shadow-lg">
						Shadcn component
					</Button>
				</section>
			</main>
		</>
	);
}

export default Home;
