import { Button, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function Notifications(props: any) {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-1 justify-start items-center pt-7">
      <View className="w-full flex flex-row justify-center pl-3 items-center">
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
        <Text className="text-xl font-bold tracking-wider text-start w-full pl-2 py-4">
          Notifications
        </Text>
      </View>
      <View className="w-full flex flex-col justify-start items-start">
        {[1].map((e, i) => (
          <View
            key={i}
            className="w-full flex flex-row justify-between items-center  px-3"
          >
            <View className="flex flex-col justify-start items-start">
              <Text className="text-lg font-semibold tracking-widest">
                Title
              </Text>
              <Text
                className="tracking-wider text-base text-center font-semibold"
                style={{ color: "#767676" }}
              >
                Lorem Ipsum dollar.
              </Text>
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
