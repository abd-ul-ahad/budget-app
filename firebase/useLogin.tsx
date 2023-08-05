import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";
import { Auth } from "./init";

export const useLogin = () => {
  // redux toolkit
  const dispatch = useDispatch();

  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await Auth.signInWithEmailAndPassword(email, password);

      // dispatch
      LoginState({
        name: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      });

      setError(null);
    } catch (e: any) {
      setError(e.code);
    }

    return error;
  };

  //Clean up function
  useEffect(() => {
    return () => setIsStopped(true);
  }, []);

  return { login };
};
