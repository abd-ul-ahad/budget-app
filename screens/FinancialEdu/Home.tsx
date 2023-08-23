import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { buttonIcons, buttons } from "../../utils/FinancialEdu";
import LinearGradient from "react-native-linear-gradient";

const height = Dimensions.get("screen").height;

export default function FinancialHome(props: any) {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView>
      <ScrollView>
        <LinearGradient
          colors={[
            Colors[colorScheme ?? "light"].tint,

            "#fff",
            Colors[colorScheme ?? "light"].tint,
          ]}
          style={{ flex: 1, height }}
        >
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
          <View className="flex-1 px-5 pt-10">
            {buttons?.map((e, i) => (
              <View
                key={i}
                className="py-2 flex flex-row justify-between items-center"
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#5f9e83", Colors[colorScheme ?? "light"].tint]}
                  className="w-2/3 flex justify-center items-center py-6 px-8 rounded-xl"
                >
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("FinancialContent", {
                        slug: e.slug,
                        title: e.title,
                      })
                    }
                  >
                    <Text
                      style={{
                        textShadowColor: "rgba(0, 0, 0, 0.15)",
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 10,
                      }}
                      className="text-xl text-center font-bold tracking-widest text-white"
                    >
                      {e.title}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Image
                  style={{ width: 80, height: 80, resizeMode: "cover" }}
                  source={buttonIcons[i]}
                />
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
