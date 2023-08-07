// Import required modules and components
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { FadeInView } from "../../components/animations";
import React, { useEffect, useState } from "react";
import Single from "../../components/plan/Single";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useFirestore } from "../../firebase/useFirestore";
// Define the PlanScreen component
export default function PlanScreen(props: any) {
  const colorScheme = useColorScheme();

  const user = useSelector((state: RootState) => state.user);

  const { getDocument } = useFirestore("plans", user.uid!);

  const [resp, setResp] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      budgetAmount: number;
      currentAmount: number;
    }>
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      r.push({
        title: e._data.title,
        id: e.id,
        category: e._data.category,
        budgetAmount: e._data.budgetAmount,
        currentAmount: e._data.currentAmount,
      });
    });

    setResp(r);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Render the PlanScreen UI
  return (
    <>
      {/* SafeAreaView ensures content doesn't go below the device's safe area */}
      <SafeAreaView>
        {/* FadeInView provides a fade-in animation effect */}
        <FadeInView _duration={300}>
          {/* ScrollView provides a scrollable container */}
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={load} />
            }
            className="min-h-screen"
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            {/* Header */}
            <View className="flex justify-center items-start pt-5 pb-3">
              <Text className="text-xl font-semibold tracking-wider pl-3">
                Plans
              </Text>
            </View>

            {/* New Plan Button */}
            <View className="px-3 space-y-2">
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("EditPlan", {
                    title: 0,
                    category: "",
                    amount: "",
                  });
                }}
                className="flex justify-center items-center rounded-lg"
                style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
              >
                <Text className="text-white py-3">New Plan</Text>
              </TouchableOpacity>

              {/* List of Existing Plans */}
              <View className="pt-3 pb-28">
                {/* Placeholder for No Plan */}
                {/* Commented out for now will be visible when there is no plan*/}
                {resp?.length === 0 && (
                  <Text className="text-lg font-semibold tracking-wider pl-2">
                    No Plan
                  </Text>
                )}

                {/* Render multiple plans */}
                {resp?.map((e, i, a) => {
                  return (
                    <View key={i}>
                      {/* Plan Item */}
                      <TouchableOpacity
                        className="py-3"
                        onPress={() => {
                          props.navigation.navigate("EditPlan", {
                            title: e.title,
                            category: e.category,
                            amount: e.budgetAmount,
                            id: e.id,
                          });
                        }}
                      >
                        {/* Render the Single component with progress */}
                        <Single
                          title={e.title}
                          category={e.category}
                          amount={e.budgetAmount}
                          currentAmount={e.currentAmount}
                        />
                      </TouchableOpacity>
                      {/* Divider between plan items */}
                      {a.length - 1 !== i && (
                        <View
                          style={{ height: 1, backgroundColor: "gray" }}
                          className="w-full"
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </FadeInView>
      </SafeAreaView>
    </>
  );
}
