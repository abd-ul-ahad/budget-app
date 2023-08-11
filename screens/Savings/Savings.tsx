import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function Savings(props: any) {
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
            Savings
          </Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}
