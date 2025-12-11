import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../reducer/user";

export function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [signUpLastname, setSignUpLastname] = useState("");
  const [signUpFirstname, setSignUpFirstname] = useState("");
  const [signUpMail, setSignUpMail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.fr|yahoo\.com|outlook\.com|hotmail\.com|live\.com|icloud\.com|protonmail\.com)$/;

  const handleRegister = () => {
    setErrorMessage("");
    setSuccessMessage("");

    // --- Vérification des champs ---
    if (!signUpFirstname || !signUpLastname || !signUpMail || !signUpPassword) {
      setErrorMessage("Merci de remplir tous les champs.");
      return;
    }

    // --- Vérification Email ---
    if (!emailRegex.test(signUpMail)) {
      setErrorMessage("Adresse email invalide ou non reconnue.");
      return;
    }

    // --- Requête Backend ---
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: signUpFirstname,
        lastname: signUpLastname,
        mail: signUpMail,
        password: signUpPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          // --- Redux login instant ---
          dispatch(
            login({
              token: data.userData.token,
              firstname: signUpFirstname,
              lastname: signUpLastname,
            })
          );

          // --- Message de succès ---
          setSuccessMessage("🎉 Compte créé avec succès ! Bienvenue parmi nous.");

          // --- Redirection (petit délai pour l'effet) ---
          setTimeout(() => {
            router.push("/");
          }, 800);
        } else {
          setErrorMessage(data.error);
        }
      })
      .catch(() => setErrorMessage("Erreur de connexion."));
  };

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Créer un compte</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer mon compte</DialogTitle>

            {errorMessage && (
              <DialogDescription className="italic text-red-600">
                {errorMessage}
              </DialogDescription>
            )}

            {successMessage && (
              <DialogDescription className="italic text-green-600 font-semibold">
                {successMessage}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Prénom</Label>
              <Input onChange={(e) => setSignUpFirstname(e.target.value)} />
            </div>

            <div className="grid gap-3">
              <Label>Nom</Label>
              <Input onChange={(e) => setSignUpLastname(e.target.value)} />
            </div>

            <div className="grid gap-3">
              <Label>Email</Label>
              <Input
                name="mail"
                onChange={(e) => setSignUpMail(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                onKeyDown={onKeyPressHandler}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Retour</Button>
            </DialogClose>

            <Button type="button" onClick={handleRegister}>
              Créer mon compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default Signup;

