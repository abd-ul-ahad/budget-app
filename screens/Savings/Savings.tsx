import {
  Dimensions,
  SafeAreaView,
  TextInput,
  useColorScheme,
} from "react-native";
import WaveChart from "../../components/WaveChart";
import Colors from "../../constants/Colors";
import { ScrollView } from "react-native";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Savings(props: any) {
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState<boolean>();

  const onSubmit = async () => {};

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
          <Text className="text-2xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Savings
          </Text>
        </View>
        <View className="px-3 mt-3 space-y-2">
          <Text className="dark:text-white text-lg font-semibold">
            Spend Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
          <TouchableOpacity
            disabled={loading}
            onPress={() => onSubmit()}
            className="flex justify-center items-center rounded-lg mt-5"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex pl-3 flex-row justify-between items-center mt-4">
          <Text className="text-xl font-bold tracking-wider">This month</Text>
          <TouchableOpacity className="flex flex-row justify-between items-center py-2 px-3">
            <Text className="text-base text-red-600 font-semibold tracking-wider">
              All
            </Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="rgb(220, 38, 38)"
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 800 }}>
          <WaveChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
