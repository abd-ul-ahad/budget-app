import Colors from "../constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { useFirestore } from "../firebase/useFirestore";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import formattedDate from "../utils/FormatDate";

const Transaction = (props: any) => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View className="px-3 pt-1 pb-9 space-y-2">
      <Text className="text-lg font-bold dark:text-white">Transactions</Text>

      <View>
        {props.resp.length === 0 && (
          <View className="h-screen">
            <Text className="w-full text-center pb-2 mt-2">
              No Transactions
            </Text>
          </View>
        )}
        {props.resp
          ?.sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds)
          .map((e: any, i: number, a: any) => (
            <Single
              id=""
              key={i}
              title={e.description}
              date={formattedDate(e.createdAt)}
              amount={e.amount}
              isIncome={e.category === "#income"}
              isLast={a.length - 1 === i}
              navigation={props.navigation}
              category={e.category}
            />
          ))}
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
  category,
  id,
}: {
  id: string;
  category: string;
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
          navigation.navigate("EditTransaction", { title, date, amount, id })
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
            className="text-xs"
            style={{ color: Colors[colorScheme ?? "light"].tint }}
          >
            {category}
          </Text>
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
