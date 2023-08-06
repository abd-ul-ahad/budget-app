import * as React from "react";
import { useColorScheme } from "react-native";

// importing redux provider
import { store } from "./store/index";
import { Provider } from "react-redux";

import "./constants/global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import CheckAuth from "./context/CheckAuth";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CheckAuth />
      </ThemeProvider>
    </Provider>
  );
}
