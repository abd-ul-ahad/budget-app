import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {
  storeNotification,
  triggerNotifications,
} from "../../utils/Notifications";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { TextInput } from "react-native";
import { isValidOrFutureDate } from "../../utils/FormatDate";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications(props: any) {
  const colorScheme = useColorScheme();
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [isValidAmount, setIsValidAmount] = useState<boolean | null>(null);
  const [isValidDate, setIsValidDate] = useState<boolean | null>(null);
  const [isValidIncome, setIsValidIncome] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  const onSubmit = async () => {
    setLoading(true);
    console.log({ amount, income, date });

    try {
      if (amount < 1) {
        setIsValidAmount(false);
        return;
      }
      setIsValidAmount(true);

      if (income <= 0) {
        setIsValidIncome(false);
        return;
      }
      setIsValidIncome(true);

      if (!isValidOrFutureDate(date)) {
        setIsValidDate(false);
        return;
      }
      setIsValidDate(true);

      // calculating.
      let r = suggestSavingsPercentage(date, amount, income);
      setResult(r);
      triggerNotifications("Strategies", r);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 justify-start items-center pb-7">
          <View className="w-full flex flex-row justify-between items-center pt-4">
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
              Goal based saving
            </Text>

            <TouchableOpacity
              className="py-4 px-3"
              onPress={() => props.navigation.navigate("Home")}
            >
              <FontAwesome
                name="home"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          <View className="w-full flex flex-col justify-center items-start px-3 pt-8">
            {/* Amount */}
            <Text
              className="tracking-wider mb-2 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Amount
            </Text>
            <TextInput
              className="py-2 px-3 w-full mb-2 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="Amount"
              placeholderTextColor="grey"
              keyboardType="numeric"
              value={`${amount === 0 ? "" : amount}`}
              onChangeText={(text) => setAmount(+text)}
            />
            <Text
              className="text-base text-red-500 font-bold"
              style={{ opacity: isValidAmount === false ? 1 : 0 }}
            >
              Invalid amount
            </Text>
            {/* salary */}
            <Text
              className="tracking-wider mb-2 mt-2 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Income
            </Text>
            <TextInput
              className="py-2 px-3 w-full mb-2 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="Amount"
              placeholderTextColor="grey"
              keyboardType="numeric"
              value={`${income === 0 ? "" : income}`}
              onChangeText={(text) => setIncome(+text)}
            />
            <Text
              className="text-base text-red-500 font-bold"
              style={{ opacity: isValidIncome === false ? 1 : 0 }}
            >
              Invalid amount
            </Text>
            {/* date */}
            <Text
              className="tracking-wider mb-2 mt-3 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              Select a date:
            </Text>
            <Calendar
              style={{ width: Dimensions.get("window").width / 1.05 }}
              onDayPress={(day) => {
                setDate(day.dateString);
              }}
              markedDates={{
                [date]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "orange",
                },
              }}
            />
            <Text
              className="text-base text-red-500 font-bold"
              style={{ opacity: isValidDate === false ? 1 : 0 }}
            >
              Invalid Date
            </Text>
          </View>
          <View className="w-full p-3">
            <Text
              className="tracking-wider mb-1 mt-1 text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              {result}
            </Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() => onSubmit()}
              className="flex justify-center items-center mt-5 w-full flex-row py-4 rounded-full"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text
                style={{ color: "white" }}
                className="text-sm tracking-wide "
              >
                {loading ? "Calculating..." : "Calculate"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function suggestSavingsPercentage(
  date: string,
  amount: number,
  monthlyIncome: number
): string {
  const targetDate = new Date(date);
  const currentDate = new Date();

  const monthsRemaining =
    (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
    targetDate.getMonth() -
    currentDate.getMonth();
  const savingsRequired = amount - monthlyIncome * monthsRemaining;

  if (savingsRequired <= 0) {
    return "You've already saved enough for this goal!";
  }

  let savingsPercentage =
    (savingsRequired / (monthlyIncome * monthsRemaining)) * 100;

  if (savingsPercentage <= 5) {
    return "You should aim to save at least 5% of your income.";
  } else if (savingsPercentage <= 10) {
    return "You should aim to save at least 10% of your income.";
  } else if (savingsPercentage <= 15) {
    return "You should aim to save at least 15% of your income.";
  } else if (savingsPercentage <= 20) {
    return "You should aim to save at least 20% of your income.";
  } else if (savingsPercentage <= 25) {
    return "You should aim to save at least 25% of your income.";
  } else if (savingsPercentage <= 30) {
    return "You should aim to save at least 30% of your income.";
  } else {
    return "You should aim to save at least 40% of your income or more.";
  }
}