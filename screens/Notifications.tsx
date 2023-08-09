import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { getNotifications } from "../utils/Notifications";
import { useEffect, useState } from "react";
import type { NotificationData } from "../utils/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Notifications(props: any) {
  const colorScheme = useColorScheme();
  const [notifi, setNotifi] = useState<Array<NotificationData>>([]);
  const [reload, setReload] = useState<boolean>(false);

  const load = async () => {
    let resp = await getNotifications();
    resp === null ? setNotifi([]) : setNotifi(JSON.parse(resp));
  };

  useEffect(() => {
    load();
  }, [reload]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 justify-start items-center pt-7">
        <View className="w-full flex flex-row justify-between items-center">
          <TouchableOpacity
            className="py-4 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold tracking-wider text-start pl-2 py-4">
            Notifications
          </Text>
          <TouchableOpacity
            className="py-4 px-5"
            onPress={async () => {
              try {
                await AsyncStorage.clear();
                setReload(!reload);
              } catch {}
            }}
          >
            <MaterialIcons
              name="delete-sweep"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View className="w-full flex flex-col justify-start items-start px-3 pt-8">
          {notifi?.length === 0 && (
            <Text className="text-base font-semibold tracking-wider w-full text-center">
              No Notifications
            </Text>
          )}
          {notifi?.reverse()?.map((e, i) => (
            <View
              key={i}
              style={{
                borderBottomWidth: notifi.length - 1 === i ? 0 : 1,
                borderColor: "#767676",
              }}
              className="w-full flex flex-row justify-between items-center py-3"
            >
              <View className="flex flex-col justify-start items-start">
                <Text className="text-lg font-semibold tracking-widest">
                  {e.title}
                </Text>
                {e.body?.body !== "" && (
                  <Text
                    className="tracking-wider text-base text-center font-semibold"
                    style={{ color: "#767676" }}
                  >
                    {e.body?.body}
                  </Text>
                )}
              </View>
              <Text
                className="tracking-wider text-base text-center font-semibold"
                style={{ color: "#767676" }}
              >
                {e?.body?.dateTime !== undefined &&
                  formatTimeDifference(
                    Date.now() - (Date.now() - e?.body?.dateTime)
                  )}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
function formatTimeDifference(dateTime: number) {
  const timeDifferenceInSeconds = Math.floor((Date.now() - dateTime) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} second${
      timeDifferenceInSeconds !== 1 ? "s" : ""
    }`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 2592000) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (timeDifferenceInSeconds < 31536000) {
    const months = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 31536000);
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
}
