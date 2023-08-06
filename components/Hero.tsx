import {
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  useColorScheme,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ToWords } from "to-words";
import { FadeInView } from "./animations";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useFirestore } from "../firebase/useFirestore";
import { Auth } from "../firebase/init";
import { CalculateBalance } from "../utils/CalculateBalance";

const image = require("../assets/images/banner.png");

const Hero = () => {
  const toWords = new ToWords();
  const [incomeOrSpend, setIncomeOrSpend] = useState<number | null>(null);
  const [balances, setBalances] = useState<{
    incomeBalance: number;
    outcomeBalance: number;
    currentBalance: number;
  }>();

  const load = async () => {
    const { incomeBalance, outcomeBalance, currentBalance } =
      await CalculateBalance();
      setBalances({incomeBalance, outcomeBalance, currentBalance})
  };

  load();

  return (
    <>
      <View
        style={{ width: "100%", height: Dimensions.get("window").height / 3 }}
      >
        <ImageBackground
          source={image}
          resizeMode="cover"
          className="flex-1 justify-between items-start flex-col px-3 pb-5"
        >
          <View className="flex justify-end items-end w-full">
            <TouchableOpacity className="py-4 px-4">
              <Feather name="bell" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex justify-start items-start w-full space-y-2">
              <Text className="text-white text-xl">My Balance</Text>
              <FlatList
                data={[balances?.incomeBalance]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={(item ) => (
                  <View>
                    <Text className="text-white text-3xl font-bold">
                      £ {item.item}
                    </Text>
                    <Text className="text-white text-sm">
                      {toWords.convert(item.item!)} Pounds
                    </Text>
                  </View>
                )}
                keyExtractor={() => `1`}
              />
            </View>
          </View>

          <View className="flex justify-between items-center flex-row w-full">
            <TouchableOpacity
              className="px-10 py-3 rounded-xl"
              style={styles.button}
              onPress={() =>
                setIncomeOrSpend((prev) => (prev === 0 ? null : 0))
              }
            >
              <Text className="text-white">Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-10 py-3 rounded-xl"
              style={styles.button}
              onPress={() =>
                setIncomeOrSpend((prev) => (prev === 1 ? null : 1))
              }
            >
              <Text className="text-white">Add Spending</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {incomeOrSpend === 0 ? (
        <AddIncome setIncomeOrSpend={setIncomeOrSpend} />
      ) : incomeOrSpend === 1 ? (
        <AddSpending setIncomeOrSpend={setIncomeOrSpend} />
      ) : null}
    </>
  );
};

const AddIncome = ({
  setIncomeOrSpend,
}: {
  setIncomeOrSpend: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { addDocument } = useFirestore("transactions", Auth.currentUser?.uid!);

  const Submit = async () => {
    if (amount.length >= 1 && description.length >= 1) {
      setLoading(true);
      const d = addDocument({
        amount: +amount,
        description: description,
        category: "#income",
        plan: "Deposit",
      }).then(() => {
        "transaction added";
      });
      setLoading(false);
      setIncomeOrSpend(null);
    }
  };

  return (
    <FadeInView _duration={100}>
      <View className="px-3 space-y-5 py-4">
        <View className="flex justify-between flex-row items-center">
          <Text className="dark:text-white text-xl font-bold">Add Income</Text>
          <TouchableOpacity
            className="pl-1 py-1"
            onPress={() => setIncomeOrSpend(null)}
          >
            <Ionicons
              name="close-sharp"
              size={28}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Income Source
          </Text>
          <TextInput
            onChangeText={(text) => setDescription(text)}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={description}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="e.g Salary"
            keyboardType="default"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">Amount</Text>
          <TextInput
            onChangeText={(text) => setAmount(text)}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={amount}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          disabled={loading}
          onPress={() => Submit()}
          className="flex justify-center items-center rounded-lg"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
        >
          <Text className="text-white py-3">Deposit</Text>
        </TouchableOpacity>

        {/* divider */}
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      </View>
    </FadeInView>
  );
};

const AddSpending = ({
  setIncomeOrSpend,
}: {
  setIncomeOrSpend: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const colorScheme = useColorScheme();

  const [source, onChangeSource] = useState<string>("");
  const [amount, onChangeAmount] = useState<string>("");

  return (
    <FadeInView _duration={100}>
      <View className="px-3 space-y-5 py-4">
        <View className="flex justify-between flex-row items-center">
          <Text className="dark:text-white text-xl font-bold">
            Add Spending
          </Text>
          <TouchableOpacity
            className="pl-1 py-1"
            onPress={() => setIncomeOrSpend(null)}
          >
            <Ionicons
              name="close-sharp"
              size={28}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Description
          </Text>
          <TextInput
            onChangeText={onChangeSource}
            className="border-2 py-2 px-3 dark:text-white rounded-lg"
            value={source}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="e.g House Rent"
            keyboardType="default"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Spend Amount <Text className="text-sm">(Limit: 10000)</Text>
          </Text>
          <TextInput
            onChangeText={onChangeAmount}
            className="py-2 px-3 dark:text-white rounded-lg"
            value={amount}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">
            Category
          </Text>
          <TextInput
            onChangeText={onChangeSource}
            className="border-2 py-2 px-3 dark:text-white rounded-lg"
            value={source}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="choose..."
            keyboardType="default"
          />
        </View>
        <View className="space-y-1">
          <Text className="dark:text-white text-lg font-semibold">Plan</Text>
          <TextInput
            onChangeText={onChangeSource}
            className="border-2 py-2 px-3 dark:text-white rounded-lg"
            value={source}
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholderTextColor="grey"
            placeholder="choose..."
            keyboardType="default"
          />
        </View>
        <TouchableOpacity
          className="flex justify-center items-center rounded-lg"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
        >
          <Text className="text-white py-3">Credit</Text>
        </TouchableOpacity>
        {/* divider */}
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      </View>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
});

export default Hero;
