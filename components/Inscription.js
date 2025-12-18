// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { useState } from "react";
// import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";
// import { login } from "../reducer/user";

// export function Inscription() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [isOpen, setIsOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [signUpFirstname, setSignUpFirstname] = useState("");
//   const [signUpLastname, setSignUpLastname] = useState("");
//   const [signUpMail, setSignUpMail] = useState("");
//   const [signUpPassword, setSignUpPassword] = useState("");

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleRegister = async () => {
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!signUpFirstname || !signUpLastname || !signUpMail || !signUpPassword) {
//       setErrorMessage("Merci de remplir tous les champs.");
//       return;
//     }
//     if (!emailRegex.test(signUpMail)) {
//       setErrorMessage("Adresse email invalide.");
//       return;
//     }
//     if (signUpPassword.length < 6) {
//       setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/users/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firstname: signUpFirstname,
//           lastname: signUpLastname,
//           mail: signUpMail,
//           password: signUpPassword,
//         }),
//       });

//       const data = await response.json();

//       if (data.result) {
//         dispatch(
//           login({
//             token: data.token,
//             firstname: data.firstname,
//             lastname: data.lastname,
//             mail: data.mail,
//           })
//         );

//         setSuccessMessage("🎉 Compte créé avec succès !");

//         setTimeout(() => {
//           setIsOpen(false);
//           router.push("/");
//         }, 1200);
//       } else {
//         setErrorMessage(data.error || "Une erreur est survenue.");
//       }
//     } catch (error) {
//       setErrorMessage("Erreur de connexion au serveur.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild onClick={() => setIsOpen(true)}>
//         <Button variant="ghost">Créer un compte</Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Créer mon compte</DialogTitle>

//           {errorMessage && (
//             <DialogDescription className="italic text-red-600 font-semibold">
//               {errorMessage}
//             </DialogDescription>
//           )}

//           {successMessage && (
//             <DialogDescription className="italic text-green-600 font-semibold">
//               {successMessage}
//             </DialogDescription>
//           )}
//         </DialogHeader>

//         <div className="grid gap-4 py-4">
//           <div className="grid gap-3">
//             <Label>Prénom</Label>
//             <Input
//               value={signUpFirstname}
//               onChange={(e) => setSignUpFirstname(e.target.value)}
//               placeholder="Jean"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="grid gap-3">
//             <Label>Nom</Label>
//             <Input
//               value={signUpLastname}
//               onChange={(e) => setSignUpLastname(e.target.value)}
//               placeholder="Dupont"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="grid gap-3">
//             <Label>Email</Label>
//             <Input
//               type="email"
//               value={signUpMail}
//               onChange={(e) => setSignUpMail(e.target.value)}
//               placeholder="exemple@email.com"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="grid gap-3">
//             <Label>Mot de passe</Label>
//             <Input
//               type="password"
//               value={signUpPassword}
//               onChange={(e) => setSignUpPassword(e.target.value)}
//               placeholder="••••••••"
//               disabled={isLoading}
//             />
//             <p className="text-xs text-gray-500">Minimum 6 caractères</p>
//           </div>
//         </div>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline" disabled={isLoading}>
//               Annuler
//             </Button>
//           </DialogClose>

//           <Button onClick={handleRegister} disabled={isLoading}>
//             {isLoading ? "Création..." : "Créer mon compte"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default Inscription;

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

export default function Inscription() {
	const router = useRouter();
	const dispatch = useDispatch();

	const [isOpen, setIsOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [signUpFirstname, setSignUpFirstname] = useState('');
	const [signUpLastname, setSignUpLastname] = useState('');
	const [signUpMail, setSignUpMail] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
			const response = await fetch('http://localhost:3000/users/signup', {
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

				setIsOpen(false);

				setSuccessMessage('🎉 Compte créé avec succès !');

				setTimeout(() => {
					setIsOpen(false);
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
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild onClick={() => setIsOpen(true)}>
				<Button variant="ghost" className="w-fit px-0 text-xl font-normal hover:text-orange xl:text-base">
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
			</DialogContent>
		</Dialog>
	);
}
