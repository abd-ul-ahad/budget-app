import { View, useColorScheme } from "react-native";
import { Text } from "../Themed";
import Colors from "../../constants/Colors";
import { ProgressBar } from "react-native-paper";

export default function Single({
  progress = 0,
  category,
  amount,
  title,
  currentAmount,
}: {
  currentAmount: number;
  category: string;
  amount: number;
  title: string;
  progress?: number;
}) {
  const colorScheme = useColorScheme();

  function calculatePercentage(): number {
    if (currentAmount) {
      return +currentAmount / +amount;
    }

    return 0;
  }

  return (
    <>
      <Text
        className="font-semibold tracking-wider rounded-lg pb-1"
        style={{
          color: Colors[colorScheme ?? "light"].tint,
        }}
      >
        #{category}
      </Text>
      <Text className="w-full pb-2 text-start text-xl font-bold tracking-widest">
        {title}
      </Text>
      <View className="pb-2 flex flex-row justify-between items-center">
        <Text className="text-base font-semibold tracking-widest">
          £ {currentAmount}
        </Text>
        <Text className="text-base font-semibold tracking-widest">
          £ {amount}
        </Text>
      </View>
      <ProgressBar
        style={{ height: 10 }}
        progress={calculatePercentage()}
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
