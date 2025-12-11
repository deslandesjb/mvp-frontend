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

export function Signin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [signUpMail, setSignUpMail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const handleRegister = () => {
    if (!signUpMail || !signUpPassword) {
      setErrorMessage("Please fill all fields");
      return;
    }

    fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mail: signUpMail,
        password: signUpPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              token: data.userData.token,
              firstname: data.userData.firstname,
              lastname: data.userData.lastname,
            })
          );

          router.push("/");
        } else {
          setErrorMessage(data.error);
        }
      })
      .catch(() => {
        setErrorMessage("Connection error. Please try again.");
      });
  };

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Me connecter</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Me connecter</DialogTitle>
            <DialogDescription className="italic text-red-600">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
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
                name="password"
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
              Connexion
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default Signin;
