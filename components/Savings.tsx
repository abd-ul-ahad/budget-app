import { ProgressBar } from "react-native-paper";
import { Text, View } from "./Themed";
import { TouchableOpacity, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import calculateSavingsByMonth from "../utils/Savings";

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  const [currentMonthSavings, setCurrentMonthSavings] = useState<{
    currentAmount: number;
    targetAmount: number;
    month: string;
  }>({ targetAmount: 0, currentAmount: 0, month: "" });

  useEffect(() => {
    setCurrentMonthSavings(calculateSavingsByMonth(props.savings));
  }, []);

  console.log(
    currentMonthSavings.currentAmount / currentMonthSavings.targetAmount,
    currentMonthSavings.currentAmount,
    currentMonthSavings.targetAmount
  );

  return (
    <View className="px-4 mb-5">
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold dark:text-white">Savings</Text>
        <TouchableOpacity
          className="px-1 py-1"
          onPress={() => props.navigation.navigate("Savings")}
        >
          <Entypo
            name="chevron-right"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>
      {props.savings?.length === 0 ? (
        <Text className="w-full text-center pb-2 mt-2">No savings</Text>
      ) : (
        <Single
          month={currentMonthSavings.month}
          amount={currentMonthSavings.targetAmount}
          progress={
            currentMonthSavings.currentAmount !== 0 ||
            currentMonthSavings.currentAmount !== 0
              ? currentMonthSavings.currentAmount /
                currentMonthSavings.currentAmount
              : 0
          }
        />
      )}
    </View>
  );
}

const Single = ({
  month,
  amount,
  progress,
}: {
  month: string;
  amount: number;
  progress: number;
}) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      className="w-full px-3 rounded-xl mr-10 py-4"
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
    >
      <Text className="w-full text-start text-lg font-bold tracking-widest">
        {month}
      </Text>
      <View className="w-full">
        <Text
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
          }}
          className="w-full text-right text-base font-semibold tracking-widest"
        >
          £ {amount}
        </Text>
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
      </View>
    </TouchableOpacity>
  );
};
