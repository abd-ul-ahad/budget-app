import { useState } from "react";

//firebase imports
import { Auth } from "./init";
// react redux
import { useDispatch } from "react-redux";
import { login as LoginState } from "../store/slices/userSlice";

export const useSignUp = () => {
  const dispatch = useDispatch();

  //creating Signup function to import it in other component
  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { user } = await Auth.createUserWithEmailAndPassword(email, password);

    // dispatch
    dispatch(
      LoginState({
        name: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      })
    );

    //add display name for the user
    //   await updateProfile(user, { displayName });
  };

  return { signup };
};
