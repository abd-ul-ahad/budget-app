import { Dimensions, SafeAreaView, useColorScheme } from "react-native";
import WaveChart from "../../components/WaveChart";
import Colors from "../../constants/Colors";
import { ScrollView } from "react-native";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ScrollView>
        <View className="flex-row flex mt-6 justify-start items-center">
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
            Savings
          </Text>
        </View>
        <View style={{ height: 800 }}>
          <WaveChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
