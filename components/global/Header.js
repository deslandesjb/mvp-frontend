import {Menu} from 'lucide-react';
import Link from 'next/link';

export default function Header() {
	return (
		<header className="font-title flex h-16 items-center justify-between px-4">
			<div>
				<Link href="/">LOGO</Link>
			</div>
			<div>
				{/* mobile */}
				<div>
					{/* <svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-menu-icon lucide-menu">
						<path d="M4 5h16" />
						<path d="M4 12h16" />
						<path d="M4 19h16" />
					</svg> */}
					<Menu />
				</div>
				<nav></nav>
				{/* desktop */}
				<nav>{/* <Link></Link> */}</nav>
			</div>
		</header>
	);
}
