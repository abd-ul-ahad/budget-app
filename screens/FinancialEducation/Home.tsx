import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  View,
  Text,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export const FinancialHome = (props: any) => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView>
      <ScrollView>
        <LinearGradient
          start={{ x: 0.0, y: 0.15 }}
          end={{ x: 0.5, y: 1.0 }}
          colors={["#adfbd6", "#ffbf79"]}
          style={{ height }}
          className="flex justify-start items-center flex-1"
        >
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
          </View>
          <Text
            style={{ color: Colors[colorScheme ?? "light"].tint }}
            className="text-3xl font-bold tracking-widest mt-5"
          >
            Financial Education
          </Text>
          <View className="space-y-3 mt-10">
            {items.map((e, i) => (
              <TouchableOpacity
                className="rounded-2xl"
                style={{
                  width: width * 0.9,
                  backgroundColor: Colors[colorScheme ?? "light"].tint,
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <Text
                  style={{ color: "white" }}
                  className="text-2xl font-bold tracking-widest px-7 py-10"
                >
                  {e.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const items = [
  {
    title: "Budgeting",
    path: "",
  },
  {
    title: "Savings",
    path: "",
  },
  {
    title: "Investing",
    path: "",
  },
  {
    title: "Management",
    path: "",
  },
];
