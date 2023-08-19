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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useFirestore } from "../../firebase/useFirestore";
import { Snackbar } from "react-native-paper";
import { reload } from "../../store/slices/reloadSlice";
import LinearGradient from "react-native-linear-gradient";

export default function PlanScreen(props: any) {
  const colorScheme = useColorScheme();
  const reloadState = useSelector((state: RootState) => state.reload);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { getDocument } = useFirestore("plans", user.uid!);

  const [resp, setResp] = useState<Array<any>>();
  const [refreshing, setRefreshing] = useState(false);
  const [toggleSnack, setToggleSnack] = useState<boolean>(false);

  const load = async () => {
    setRefreshing(true);
    try {
      await getDocument().then((doc) => setResp(doc?.docs));
    } catch {
      setToggleSnack(true);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

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
              <LinearGradient
                start={{ x: 0.0, y: 0.15 }}
                end={{ x: 0.5, y: 1.0 }}
                colors={["#ffbf79", "#adfbd6"]}
                className="rounded-lg"
              >
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("EditPlan", {
                      title: 0,
                      category: "",
                      amount: "",
                    });
                  }}
                  className="flex justify-center items-center"
                >
                  <Text className="text-black font-semibold tracking-wider py-3">
                    New Plan
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

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
                            title: e._data.title,
                            category: e._data.category,
                            amount: `${e._data.budgetAmount}`,
                            id: e.id,
                          });
                        }}
                      >
                        {/* Render the Single component with progress */}
                        <Single
                          title={e._data.title}
                          category={e._data.category}
                          amount={e._data.budgetAmount}
                          currentAmount={e._data.currentAmount}
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
        <Snackbar
          style={{ marginBottom: "3%" }}
          visible={toggleSnack}
          onDismiss={() => setToggleSnack(false)}
          action={{
            label: "Reload",
            onPress: () => dispatch(reload()),
          }}
        >
          Please reload and try again
        </Snackbar>
      </SafeAreaView>
    </>
  );
}
