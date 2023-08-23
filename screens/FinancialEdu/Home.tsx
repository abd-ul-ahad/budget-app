import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { buttons } from "../../utils/FinancialEdu";

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
          <Text
            style={{ color: "#767676" }}
            className="text-lg font-extrabold tracking-wider"
          >
            Contents
          </Text>
          {buttons?.map((e, i) => (
            <View key={i} className="py-2">
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("FinancialContent", {
                    title: e,
                  })
                }
                className="w-full flex justify-center items-start py-3 px-5"
              >
                <Text className="text-xl font-bold tracking-widest">{e}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
