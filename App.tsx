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
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const colorScheme = useColorScheme();

  // Managing permissions for notifications
  // React.useEffect(() => {
  //   Permissions.getAsync(Permissions.NOTIFICATIONS)
  //     .then((statusObj) => {
  //       if (statusObj.status !== "granted") {
  //         return Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       }
  //       return statusObj;
  //     })
  //     .then((statusObj) => {
  //       if (statusObj.status !== "granted") {
  //         return;
  //       }
  //     });
  // }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CheckAuth />
      </ThemeProvider>
    </Provider>
  );
}
