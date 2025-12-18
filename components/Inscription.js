import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

import {useRouter} from 'next/router';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../reducer/user';

// export default function Inscription({isOpen, onOpenChange, switchToLogin, }) {
export default function Inscription(props) {
	// console.log(props);
	const router = useRouter();
	const dispatch = useDispatch();

	const [internalOpen, setInternalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [signUpFirstname, setSignUpFirstname] = useState('');
	const [signUpLastname, setSignUpLastname] = useState('');
	const [signUpMail, setSignUpMail] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Gestion de l'état (contrôlé par le parent ou interne)
	const isControlled = typeof props.isOpen !== 'undefined';
	const open = isControlled ? props.isOpen : internalOpen;
	const setOpen = isControlled ? props.onOpenChange : setInternalOpen;

	const handleRegister = async () => {
		setErrorMessage('');
		setSuccessMessage('');

		if (!signUpFirstname || !signUpLastname || !signUpMail || !signUpPassword) {
			setErrorMessage('Merci de remplir tous les champs.');
			return;
		}
		if (!emailRegex.test(signUpMail)) {
			setErrorMessage('Adresse email invalide.');
			return;
		}
		if (signUpPassword.length < 6) {
			setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('https://mvp-backend-seven.vercel.app/users/signup', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					firstname: signUpFirstname,
					lastname: signUpLastname,
					mail: signUpMail,
					password: signUpPassword,
				}),
			});

			const data = await response.json();

			if (data.result) {
				dispatch(
					login({
						token: data.token,
						firstname: data.firstname,
						lastname: data.lastname,
						mail: data.mail,
					}),
				);

				setOpen(false);

				setSuccessMessage('🎉 Compte créé avec succès !');

				setTimeout(() => {
					setOpen(false);
					router.push('/');
				}, 1200);
			} else {
				setErrorMessage(data.error || 'Une erreur est survenue.');
			}
		} catch (error) {
			console.error('Erreur signup:', error);
			setErrorMessage('Erreur de connexion au serveur.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className={`w-fit font-normal hover:text-orange ${props.card ? 'px-2 text-base' : 'px-0 text-xl xl:text-base'}`}>
					Créer un compte
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Créer mon compte</DialogTitle>

					{errorMessage && (
						<DialogDescription className="font-semibold italic text-red-600">{errorMessage}</DialogDescription>
					)}

					{successMessage && (
						<DialogDescription className="font-semibold italic text-green-600">{successMessage}</DialogDescription>
					)}
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-3">
						<Label>Prénom</Label>
						<Input
							value={signUpFirstname}
							onChange={(e) => setSignUpFirstname(e.target.value)}
							placeholder="Jean"
							disabled={isLoading}
						/>
					</div>

					<div className="grid gap-3">
						<Label>Nom</Label>
						<Input
							value={signUpLastname}
							onChange={(e) => setSignUpLastname(e.target.value)}
							placeholder="Dupont"
							disabled={isLoading}
						/>
					</div>

					<div className="grid gap-3">
						<Label>Email</Label>
						<Input
							type="email"
							value={signUpMail}
							onChange={(e) => setSignUpMail(e.target.value)}
							placeholder="exemple@email.com"
							disabled={isLoading}
						/>
					</div>

					<div className="grid gap-3">
						<Label>Mot de passe</Label>
						<Input
							type="password"
							value={signUpPassword}
							onChange={(e) => setSignUpPassword(e.target.value)}
							placeholder="••••••••"
							disabled={isLoading}
						/>
						<p className="text-xs text-gray-500">Minimum 6 caractères</p>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isLoading}>
							Annuler
						</Button>
					</DialogClose>

					<Button onClick={handleRegister} disabled={isLoading}>
						{isLoading ? 'Création...' : 'Créer mon compte'}
					</Button>
				</DialogFooter>
				<div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
					<span>Déjà un compte ?</span>
					<button
						className="font-medium text-orange hover:underline"
						onClick={() => {
							if (props.switchToLogin) switchToLogin();
						}}>
						Se connecter
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
