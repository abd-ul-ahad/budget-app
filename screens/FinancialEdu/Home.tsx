import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { buttonIcons, buttons } from "../../utils/FinancialEdu";

export default function FinancialHome(props: any) {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-row flex mt-2 justify-start items-center">
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
            Financial Education
          </Text>
        </View>
        <View className="flex-1 px-5 pt-10 h-screen">
          {buttons?.map((e, i) => (
            <View
              key={i}
              className="py-2 flex flex-row justify-between items-center"
            >
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("FinancialContent", {
                    slug: e.slug,
                    title: e.title
                  })
                }
                style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
                className="w-2/3 flex justify-center items-center py-6 px-8 rounded-xl"
              >
                <Text className="text-xl text-center font-bold tracking-widest text-white">
                  {e.title}
                </Text>
              </TouchableOpacity>
              <Image
                style={{ width: 80, height: 80, resizeMode: "cover" }}
                source={buttonIcons[i]}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
