import * as Notifications from "expo-notifications";

export const triggerNotifications = async (title: string, body: string | null) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      //   data: { data: "goes here" },
    },
    trigger: null,
  });
};
