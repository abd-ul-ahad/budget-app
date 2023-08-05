import { View, useColorScheme } from "react-native";
import { Text } from "../Themed";
import Colors from "../../constants/Colors";
import { ProgressBar } from "react-native-paper";
import { useState } from "react";

export default function Single({ progress = 0 }: { progress?: number }) {
  const colorScheme = useColorScheme();

  return (
    <>
      <Text
        className="font-semibold tracking-wider rounded-lg pb-1"
        style={{
          color: Colors[colorScheme ?? "light"].tint,
        }}
      >
        #Category
      </Text>
      <Text className="w-full pb-2 text-start text-xl font-bold tracking-widest">
        Shopping
      </Text>
      <View className="pb-2 flex flex-row justify-between items-center">
        <Text className="text-base font-semibold tracking-widest">£ 5</Text>
        <Text className="text-base font-semibold tracking-widest">£ 10</Text>
      </View>
      <ProgressBar
        style={{ height: 10 }}
        progress={progress}
        className="rounded-full"
        theme={{
          colors: {
            primary: "#fdd300",
          },
        }}
      />
    </>
  );
}
