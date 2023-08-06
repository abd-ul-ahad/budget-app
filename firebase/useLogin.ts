import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";
import { Auth } from "./init";

export const useLogin = () => {
  // redux toolkit
  const dispatch = useDispatch();

  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await Auth.signInWithEmailAndPassword(email, password);

      // dispatch
      dispatch(
        LoginState({
          name: user.displayName!,
          email: user.email!,
          uid: user.uid!,
        })
      );

      setError(null);
    } catch (e: any) {
      setError(e.code);
    }

    return error;
  };

  return { login };
};
