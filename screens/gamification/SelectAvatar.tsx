import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { Avatars } from "../../_Paths";

export default function SelectAvatar(props: any) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex flex-row justify-start items-center pt-4">
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
          <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Avatar
          </Text>
        </View>
        <View className="w-full justify-center items-center flex">
          {/* <Image
            className="rounded-full"
            style={{
              width: 120,
              height: 120,
              resizeMode: "stretch",
            }}
            source={require("../../assets/images/fff.webp")}
          /> */}
          <Image
            className="rounded-full"
            style={{
              width: 120,
              height: 120,
              resizeMode: "stretch",
            }}
            source={require("../../assets/loading.gif")}
          />
        </View>
        <View
          className="justify-between pt-7"
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {Avatars.map((e, i) => {
            return (
              <TouchableOpacity key={i} className="mx-4 my-5">
                <Image
                  className="rounded-full"
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: "stretch",
                  }}
                  source={e}
                  onError={(error) =>
                    console.error("Image loading error:", error)
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
