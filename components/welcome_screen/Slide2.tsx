import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Dimensions, Image, useColorScheme } from "react-native";

const { width } = Dimensions.get("window");

export default function Slide2() {
  const colorScheme = useColorScheme();
  return (
    <>
      <View className="flex justify-start items-center">
        <Image
          style={{ width, height: 491, resizeMode: "contain" }}
          source={require("../../assets/images/fff.webp")}
        />
        <View className="space-y-2 mt-4">
          <Text
            className="text-xl text-center font-semibold"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Welcome to Budget app.
          </Text>
          <Text
            className="tracking-wider text-base text-center font-semibold"
            style={{ color: "#767676" }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
        </View>
      </View>
    </>
  );
}
