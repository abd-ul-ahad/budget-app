import Colors from "../constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { useFirestore } from "../firebase/useFirestore";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Transaction = (props: any) => {
  const user = useSelector((state: RootState) => state.user);
  const { getDocument } = useFirestore("transactions", user.uid!);

  const [resp, setResp] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      r.push(e._data);
      console.log(e._data);
    });

    setResp(r);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View className="px-3 pt-1 pb-9 space-y-2">
      <Text className="text-lg font-bold dark:text-white">Transactions</Text>

      <View>
        <Single
          title="Salary"
          date="24 April"
          amount="100000"
          isIncome={true}
          isLast={false}
          navigation={props.navigation}
        />
        <Single
          title="Salary"
          date="24 April"
          amount="100000"
          isIncome={true}
          isLast={false}
          navigation={props.navigation}
        />
        <Single
          title="Salary"
          date="24 April"
          amount="100000"
          isIncome={false}
          isLast={true}
          navigation={props.navigation}
        />
      </View>
    </View>
  );
};

export const Single = ({
  title,
  date,
  amount,
  isLast,
  isIncome,
  navigation,
}: {
  title: string;
  date: string;
  amount: string;
  isLast: boolean;
  isIncome: boolean;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();
  // const router = useRouter();

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditTransaction", { title, date, amount })
        }
        className="space-x-3 py-2 flex justify-between items-center flex-row"
      >
        <MaterialIcons
          name="compare-arrows"
          size={28}
          color={Colors[colorScheme ?? "light"].text}
        />
        <View className="flex-1 flex-col justify-center items-start">
          <Text
            className="text-lg font-semibold tracking-wider"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            {title}
          </Text>
          <Text className="text-xs" style={{ color: "gray" }}>
            {date}
          </Text>
        </View>
        <Text
          className={`${
            isIncome ? "text-green-900" : "text-red-700"
          } text-end font-semibold tracking-widest overflow-hidden`}
        >
          {isIncome ? "+" : "-"}
          {amount} £
        </Text>

        <Entypo
          name="chevron-right"
          size={25}
          color={Colors[colorScheme ?? "light"].text}
        />
      </TouchableOpacity>
      {!isLast && (
        <View
          style={{ height: 1, backgroundColor: "gray" }}
          className="w-full"
        ></View>
      )}
    </View>
  );
};

export default Transaction;
