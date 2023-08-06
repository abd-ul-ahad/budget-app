import { useState } from "react";

//firebase imports
import { Auth } from "./init";
// react redux
import { useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";

export const useSignUp = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  //creating Signup function to import it in other component
  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
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
    //add display name for the user
    //   await updateProfile(user, { displayName });
  };

  return { signup };
};
