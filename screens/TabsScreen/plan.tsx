// Import required modules and components
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { FadeInView } from "../../components/animations";
import React, { useState } from "react";
import { Plan, initialState } from "../../components/plan/type";
import Single from "../../components/plan/Single";
// import { useRouter } from "expo-router";

// Define the PlanScreen component
export default function PlanScreen(props: any) {
  const colorScheme = useColorScheme();

  // Define state for the plan with initial state as provided by initialState
  const [plan, setPlan] = useState<Plan>(initialState);

  // Render the PlanScreen UI
  return (
    <>
      {/* SafeAreaView ensures content doesn't go below the device's safe area */}
      <SafeAreaView>
        {/* FadeInView provides a fade-in animation effect */}
        <FadeInView _duration={300}>
          {/* ScrollView provides a scrollable container */}
          <ScrollView
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
                {/* <Text className="text-lg font-semibold tracking-wider pl-2">
                  No Plan
                </Text> */}

                {/* Render multiple plans */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i, a) => (
                  <View key={i}>
                    {/* Plan Item */}
                    <TouchableOpacity
                      className="py-3"
                      onPress={() => {
                        props.navigation.navigate("EditPlan", {
                          title: "Title",
                          category: "Category",
                          amount: "99",
                        });
                      }}
                    >
                      {/* Render the Single component with progress */}
                      <Single progress={e / 10} />
                    </TouchableOpacity>
                    {/* Divider between plan items */}
                    {a.length - 1 !== i && (
                      <View
                        style={{ height: 1, backgroundColor: "gray" }}
                        className="w-full"
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </FadeInView>
      </SafeAreaView>
    </>
  );
}
