import { ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useEffect, useState } from "react";
import calculateSavingsByMonth from "../../utils/Savings";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Single } from "../../components/Savings";

export default function AllTimeSavings(props: any) {
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);

  //
  const [currentMonthSavings, setCurrentMonthSavings] = useState<{
    currentAmount: number;
    targetAmount: number;
    month: string;
  }>({ targetAmount: 0, currentAmount: 0, month: "" });
  const [savings, setSavings] = useState<Array<any>>([]);

  const { getDocument: getSavings } = useFirestore("savings", user.uid!);

  useEffect(() => {
    (async () => {
      try {
        await getSavings().then((doc) => {
          const { month, currentAmount, targetAmount } =
            calculateSavingsByMonth(doc?.docs);
          doc?.docs !== undefined && setSavings(doc?.docs);
          setCurrentMonthSavings({ month, currentAmount, targetAmount });
        });
      } catch {}
    })();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
      >
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
        <View className="px-2 my-5">
          {savings?.length === 0 ? (
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
      </ScrollView>
    </SafeAreaView>
  );
}
