import {Instagram, Linkedin, Twitter} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
	return (
		<div className="relative h-[600px] md:h-[500px]" style={{clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)'}}>
			<div className="relative -top-[100vh] h-[calc(100vh+600px)] md:h-[calc(100vh+500px)]">
				<div className="sticky top-[calc(100vh-600px)] h-[600px] md:top-[calc(100vh-500px)] md:h-[500px]">
					<div className="flex h-full w-full flex-col justify-between bg-[#201e30] px-8 py-12 font-title text-white md:px-12">
						<div className="flex flex-col justify-between gap-10 md:flex-row">
							<div className="flex flex-col gap-4">
								<h3 className="text-2xl font-bold text-orange">ATLASLoot</h3>
								<p className="max-w-sm text-gray-400">
									Votre comparateur de prix préféré. Trouvez les meilleures offres parmi des milliers de produits.
								</p>
							</div>

							<div className="flex gap-10 md:gap-20">
								<div className="flex flex-col gap-2">
									<h3 className="mb-2 font-bold uppercase tracking-wider text-gray-500">Navigation</h3>
									<Link href="/" className="transition-colors hover:text-orange">
										Accueil
									</Link>
									<Link href="/lists" className="transition-colors hover:text-orange">
										Favoris
									</Link>
									<Link href="/about" className="transition-colors hover:text-orange">
										À propos
									</Link>
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="mb-2 font-bold uppercase tracking-wider text-gray-500">Légal</h3>
									<Link href="/terms" className="transition-colors hover:text-orange">
										Mentions légales
									</Link>
									<Link href="/privacy" className="transition-colors hover:text-orange">
										Confidentialité
									</Link>
								</div>
							</div>
						</div>

						<div className="flex flex-col items-end justify-between border-t border-gray-700 pt-8 md:flex-row">
							<h1 className="select-none text-[12vw] font-bold leading-[0.8] text-white/10 md:text-[10vw]">ATLAS</h1>
							<div className="flex flex-col items-end gap-4">
								<div className="flex gap-4">
									<Link href="#" className="transition-colors hover:text-orange">
										<Instagram size={24} />
									</Link>
									<Link href="#" className="transition-colors hover:text-orange">
										<Twitter size={24} />
									</Link>
									<Link href="#" className="transition-colors hover:text-orange">
										<Linkedin size={24} />
									</Link>
								</div>
								<p className="text-gray-500">© 2026 AtlasLoot. Tous droits réservés.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
