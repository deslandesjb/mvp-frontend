import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { useRouter } from "next/router";

export default function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // supprime le token
    dispatch(logout());

    // redirige vers la page principale
    router.push("/");
  }, []);

  return null;
}
