import React, { useEffect, useState } from "react";

import { login as LoginState } from "../store/slices/userSlice";
// splash screen
import * as SplashScreen from "expo-splash-screen";
// firebase auth types and auth
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// importing redux provider
import { useDispatch } from "react-redux";

//importing screens
import WelcomeScreen from "../screens/Auth/Welcome";
import LoginScreen from "../screens/Auth/Login";
import MainTabs from "../screens/MainTabs";

import EditTransactions from "../screens/Modify/EditTransactions";
import Income from "../screens/Income";
import Spending from "../screens/Spending";
import EditPlan from "../screens/Modify/EditPlan";
import { useNetInfo } from "@react-native-community/netinfo";
import NoInternet from "../screens/NoInternet";
import Notifications from "../screens/Notifications";
import GoalBasedSavings from "../screens/Savings/GoalBasedSaving";
import Savings from "../screens/Savings/Savings";
import EditProfile from "../screens/Modify/EditProfile";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function CheckAuth() {
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [isLogin, setIsLogin] = useState<boolean>(false);

  // on state changed
  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      const u = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      dispatch(LoginState({ name: u.name!, email: u.email!, uid: u.uid }));
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    await SplashScreen.hideAsync();
  }

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  }, []);

  return (
    <>
      {isConnected === false && <NoInternet />}
      {isConnected === true && (
        <NavigationContainer>
          <Stack.Navigator>
            {isLogin ? (
              <Stack.Group>
                {/* <Stack.Screen
                  name="Main"
                  options={{ headerShown: false }}
                  component={MainTabs}
                />
                <Stack.Screen
                  name="EditTransaction"
                  options={{ headerShown: false }}
                  component={EditTransactions}
                />
                <Stack.Screen
                  name="Income"
                  options={{ headerShown: false }}
                  component={Income}
                />
                <Stack.Screen
                  name="Spending"
                  options={{ headerShown: false }}
                  component={Spending}
                />
                <Stack.Screen
                  name="EditPlan"
                  options={{ headerShown: false }}
                  component={EditPlan}
                />
                <Stack.Screen
                  name="Notifications"
                  options={{ headerShown: false, presentation: "modal" }}
                  component={Notifications}
                />
                <Stack.Screen
                  name="GoalBasedSavings"
                  options={{ headerShown: false, presentation: "modal" }}
                  component={GoalBasedSavings}
                />

                <Stack.Screen
                  name="EditProfile"
                  options={{ headerShown: false, presentation: "modal" }}
                  component={EditProfile}
                /> */}
                <Stack.Screen
                  name="Savings"
                  options={{ headerShown: false, presentation: "modal" }}
                  component={Savings}
                />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen
                  name="Home"
                  options={{ headerShown: false }}
                  component={WelcomeScreen}
                />
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: false }}
                  component={LoginScreen}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
