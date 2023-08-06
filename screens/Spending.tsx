// Importing necessary modules and components
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Single } from "../components/Transaction";
import { LineGraph } from "../components/LineGraph";
import { PieGraph } from "../components/PieGraph";
import { useState } from "react";
import Colors from "../constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";

// Defining the Spending component
export default function Spending(props: any) {
  // Using hooks to manage state and get color scheme
  const colorScheme = useColorScheme();
  const [labelI, setLabelI] = useState<number>(0);

  return (
    // Wrapping the content inside SafeAreaView and ScrollView for safe handling of views
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View className="pt-2 flex justify-center items-start">
          <View className="pt-2 flex justify-between flex-row items-center w-full">
            {/* Back button */}
            <TouchableOpacity
              className="py-4 px-2"
              onPress={() => props.navigation.goBack()}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={26}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            {/* Notification icon */}
            <TouchableOpacity className="py-4 px-4">
              <Feather
                name="bell"
                size={24}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          {/* Title */}
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Spending
          </Text>
          {/* Line Graph */}
          <LineGraph
            _labels={[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]}
            _data={[
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
            ]}
          />
          {/* Categories */}
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Categories
          </Text>
          {/* Pie Graph */}
          <PieGraph />
          {/* Monthly/Yearly Button */}
          <View className="flex justify-center items-center flex-row space-x-2 pb-3 w-full">
            {["Monthly", "Yearly"].map((e, i) => {
              return (
                <TouchableOpacity
                  className="py-1 px-3 text-sm rounded-full"
                  onPress={() => setLabelI(i)}
                  style={{
                    borderWidth: 2,
                    backgroundColor:
                      labelI === i
                        ? Colors[colorScheme ?? "light"].tint
                        : "transparent",
                    borderColor: Colors[colorScheme ?? "light"].tint,
                  }}
                  key={i}
                >
                  <Text
                    style={{
                      color:
                        labelI === i
                          ? "white"
                          : Colors[colorScheme ?? "light"].text,
                    }}
                  >
                    {e}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* Transactions */}
        <View className="pt-2">
          <Text className="text-xl font-semibold tracking-wider pl-2">
            Transactions
          </Text>
          <View>
            <View className="px-2 pt-2 pb-7">
              {/* Mapping transactions */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i, a) => {
                return (
                  <Single
                    category="Category"
                    title="Salary"
                    date="24 April"
                    amount="100000"
                    navigation={props.navigation}
                    isIncome={false}
                    key={i}
                    isLast={a.length - 1 === i}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
