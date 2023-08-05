import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Slide3({navigation}: any) {
  const colorScheme = useColorScheme();
  return (
    <>
      <View className="flex justify-start items-center">
        <Image
          style={{ width, height: 491, resizeMode: "contain" }}
          source={require("../../assets/images/fff.webp")}
        />
        <View className="mt-4 space-y-5">
          <Text
            className="text-xl text-center font-semibold"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Sign in to get started.
          </Text>
          <Text
            className="tracking-wider text-base text-center font-semibold"
            style={{ color: "#767676" }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="flex justify-between items-center mt-5 flex-row py-4 rounded-full"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Entypo
              name="chevron-right"
              size={1}
              className="opacity-0"
              color={Colors[colorScheme ?? "light"].tint}
            />
            <Text style={{ color: "white" }} className="text-sm tracking-wide ">
              Continue
            </Text>
            <Entypo name="chevron-right" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
