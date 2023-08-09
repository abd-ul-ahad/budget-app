import { TouchableOpacity, useColorScheme } from "react-native";
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
    <View className="flex-1 justify-start items-center pt-7">
      <View className="w-full flex flex-row justify-between pl-3 items-center">
        <TouchableOpacity
          className="py-4 px-5"
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
      <View className="w-full flex flex-col justify-start items-start">
        {notifi?.length === 0 && (
          <Text className="text-base font-semibold tracking-wider w-full text-center">
            No Notifications
          </Text>
        )}
        {notifi.map((e, i) => (
          <View
            key={i}
            className="w-full flex flex-row justify-between items-center  px-3"
          >
            <View className="flex flex-col justify-start items-start">
              <Text className="text-lg font-semibold tracking-widest">
                {e.title}
              </Text>
              {e.body !== "" && (
                <Text
                  className="tracking-wider text-base text-center font-semibold"
                  style={{ color: "#767676" }}
                >
                  {e.body}
                </Text>
              )}
            </View>
            <Text
              className="tracking-wider text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              23d
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
