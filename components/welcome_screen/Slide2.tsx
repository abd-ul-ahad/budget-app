import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Dimensions, Image, useColorScheme } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Slide2() {
  const colorScheme = useColorScheme();
  return (
    <>
      <View className="flex justify-start items-center">
        <Image
          style={{ width, height: height / 1.7, resizeMode: "cover" }}
          source={require("../../assets/images/slide2.jpg")}
        />
        <View className="space-y-2 mt-4 px-3">
          <Text
            className="text-xl text-center font-semibold"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
           Your Financial Companion.
          </Text>
          <Text
            className="tracking-wider text-base text-center font-semibold"
            style={{ color: "#767676" }}
          >
            Take control of your finances, empowers you to save wisely, budget
            effectively.
          </Text>
        </View>
      </View>
    </>
  );
}
