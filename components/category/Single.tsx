import { useColorScheme } from "react-native";
import { Text, View } from "../Themed";
import Colors from "../../constants/Colors";

export default function Single() {
  const colorScheme = useColorScheme();

  return (
    <>
      <View className="flex flex-row">
        <Text
          className="font-semibold tracking-wider rounded-lg py-1 px-2"
          style={{
            borderWidth: 2,
            color: Colors[colorScheme ?? "light"].tint,
            borderColor: Colors[colorScheme ?? "light"].tint,
          }}
        >
          #Shopping
        </Text>
      </View>
      <View>
        <Text className="w-full text-center text-xl font-bold tracking-widest">
          Shopping
        </Text>
      </View>
    </>
  );
}
