// import styles from '../styles/Home.module.css';
import {Button} from '@/components/ui/button';

function Home() {
	return (
		<div>
			<main className="bg-orange flex h-screen flex-col items-center justify-center">
				<section>
					<h1 className="italic">
						Welcome to <a href="https://nextjs.org">Next.js!</a>
					</h1>
				</section>

				<section>
					<Button>Shadcn test</Button>
				</section>
			</main>
		</div>
	);
}

export default Home;
