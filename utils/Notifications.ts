import * as Notifications from "expo-notifications";

export const triggerNotifications = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You have got mail! 📬",
      body: "Here is the notification body",
    //   data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
};
