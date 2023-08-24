import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Slide3({ navigation }: any) {
  const colorScheme = useColorScheme();
  return (
    <ScrollView>
      <View className="flex justify-start items-center">
        <Image
          style={{ width, height: height / 1.7, resizeMode: "stretch" }}
          source={require("../../assets/images/slide3.jpg")}
        />
        <View className="mt-4 space-y-2 px-3">
          <Text
            className="text-xl text-center font-semibold"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Sign in to get started.
          </Text>
          <Text
            className="tracking-wider text-base text-center font-semibold pb-4"
            style={{ color: "#767676" }}
          >
            Discover the Budget app, your passport to financial
            freedom. Make saving a lifestyle, and turn your dreams into
            reality.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="flex justify-between items-center mt-3 flex-row py-4 rounded-full"
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
    </ScrollView>
  );
}
