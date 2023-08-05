import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, useColorScheme } from "react-native";

// importing redux provider
import { store } from "./store/index";
import { Provider } from "react-redux";

import "./constants/global.css";
import WelcomeScreen from "./screens/Auth/Welcome";
import LoginScreen from "./screens/Auth/Login";
import MainTabs from "./screens/TabsScreen";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import EditTransactions from "./screens/EditTransactions";
import Income from "./screens/Income";
import Spending from "./screens/Spending";
import EditPlan from "./screens/EditPlan";

const Stack = createNativeStackNavigator();
export default function App() {
  const colorScheme = useColorScheme();

  const isLoggedIn = false;

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            {!isLoggedIn ? (
              <Stack.Group>
                {/* <Stack.Screen
                  name="Home"
                  options={{ headerShown: false }}
                  component={WelcomeScreen}
                /> */}
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: false }}
                  component={LoginScreen}
                />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen
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
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
