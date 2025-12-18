//
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

export function Connexion({isOpen, onOpenChange, switchToSignup}) {
	const router = useRouter();
	const dispatch = useDispatch();

	const [internalOpen, setInternalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [mail, setMail] = useState('');
	const [password, setPassword] = useState('');

	// Gestion de l'état (contrôlé par le parent ou interne)
	const isControlled = typeof isOpen !== 'undefined';
	const open = isControlled ? isOpen : internalOpen;
	const setOpen = isControlled ? onOpenChange : setInternalOpen;

	const handleLogin = async () => {
		setErrorMessage('');

		if (!mail || !password) {
			setErrorMessage('Merci de remplir tous les champs.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('https://mvp-backend-seven.vercel.app/users/signin', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({mail, password}),
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

				setMail('');
				setPassword('');
				setErrorMessage('');

				router.push('/');
			} else {
				setErrorMessage(data.error || 'Identifiants incorrects.');
			}
		} catch (error) {
			console.error('Erreur lors de la connexion:', error);
			setErrorMessage('Erreur de connexion au serveur.');
		} finally {
			setIsLoading(false);
		}
	};

	const onKeyPressHandler = (e) => {
		if (e.key === 'Enter' && !isLoading) {
			handleLogin();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
					Me connecter
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Me connecter</DialogTitle>
					{errorMessage && (
						<DialogDescription className="font-semibold italic text-red-600">{errorMessage}</DialogDescription>
					)}
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-3">
						<Label>Email</Label>
						<Input
							type="email"
							value={mail}
							onChange={(e) => setMail(e.target.value)}
							onKeyDown={onKeyPressHandler}
							placeholder="votre@email.com"
							disabled={isLoading}
						/>
					</div>

					<div className="grid gap-3">
						<Label>Mot de passe</Label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={onKeyPressHandler}
							placeholder="••••••••"
							disabled={isLoading}
						/>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isLoading}>
							Annuler
						</Button>
					</DialogClose>

					<Button onClick={handleLogin} disabled={isLoading}>
						{isLoading ? 'Connexion...' : 'Se connecter'}
					</Button>
				</DialogFooter>
				<div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
					<span>Pas encore de compte ?</span>
					<button
						className="font-medium text-orange hover:underline"
						onClick={() => {
							if (switchToSignup) switchToSignup();
						}}>
						Créer un compte
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default Connexion;
