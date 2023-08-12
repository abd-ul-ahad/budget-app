import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/index";
import Hero from "../../components/Hero";
import Transaction from "../../components/Transaction";
import Colors from "../../constants/Colors";
import { Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { Text } from "../../components/Themed";
import { FadeInView } from "../../components/animations";
import Single from "../../components/plan/Single";
import { useEffect, useState } from "react";
import { useFirestore } from "../../firebase/useFirestore";
import { CalculateBalance } from "../../utils/CalculateBalance";
import { Snackbar } from "react-native-paper";
import { reload } from "../../store/slices/reloadSlice";
import { setBalances } from "../../store/slices/balanceSlice";

// Getting the width of the window
const width = Dimensions.get("window").width;

export default function Home(props: any) {
  // Getting the user data from the Redux store
  const user = useSelector((state: RootState) => state.user);
  const balances = useSelector((state: RootState) => state.balances);
  const reloadState = useSelector((state: RootState) => state.reload);
  const dispatch = useDispatch();
  // Getting the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  const { getDocument: getTransactions } = useFirestore(
    "transactions",
    user.uid!
  );
  const { getDocument: getPlanDocument } = useFirestore("plans", user.uid!);

  const [toggleSnack, setToggleSnack] = useState<boolean>(false);
  const [trans, setTrans] = useState<Array<any>>();
  const [plans, setPlans] = useState<Array<any>>();
  const [refreshing, setRefreshing] = useState(false);

  (async () => {
    const { incomeBalance, outcomeBalance, currentBalance } =
      await CalculateBalance();

    dispatch(setBalances({ incomeBalance, outcomeBalance, currentBalance }));
  })();

  const load = async () => {
    setRefreshing(true);
    try {
      await getTransactions().then((doc) => setTrans(doc?.docs));
      await getPlanDocument().then((doc) => setPlans(doc?.docs));
    } catch {
      setToggleSnack(true);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

  return (
    <SafeAreaView>
      <FadeInView _duration={400}>
        {/* ScrollView to enable scrolling */}
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            minHeight: Dimensions.get("window").height,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} />
          }
          style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
        >
          {/* Hero component */}
          <Hero
            currentBalance={balances?.currentBalance}
            navigation={props.navigation}
          />

          {/* Income and Outcome components */}

          <View className="flex flex-row items-center justify-between px-4 py-4">
            <Income
              incomeBalance={balances?.incomeBalance || 0}
              navigation={props.navigation}
            />
            <Outcome
              outcomeBalance={balances?.outcomeBalance || 0}
              navigation={props.navigation}
            />
          </View>

          {/* Plans section */}
          <View className="px-3 pt-1 pb-9 space-y-2">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg font-bold dark:text-white">Plans</Text>
              <TouchableOpacity
                className="px-1 py-1"
                onPress={() => props.navigation.navigate("Plan")}
              >
                <Entypo
                  name="chevron-right"
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
            </View>

            {/* Placeholder */}
            {plans?.length === 0 && (
              <Text className="w-full text-center pb-2 mt-2">No Plan</Text>
            )}

            {/* FlatList to display plan cards */}
            <FlatList
              className="mt-6 px-1"
              data={plans}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._data.createdAt.seconds}`}
              renderItem={(e: any) => {
                return (
                  <TouchableOpacity
                    className="px-2 rounded-xl mr-10 py-4"
                    onPress={() => {
                      props.navigation.navigate("EditPlan", {
                        title: e.item._data.title,
                        category: e.item._data.category,
                        amount: e.item._data.budgetAmount,
                        id: e.item.id,
                      });
                    }}
                    style={{
                      width: width / 2,
                      backgroundColor:
                        Colors[colorScheme ?? "light"].secondaryBackground,
                    }}
                  >
                    <Single
                      title={e.item._data.title}
                      category={e.item._data.category}
                      amount={e.item._data.budgetAmount}
                      currentAmount={e.item._data.currentAmount}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Transaction component */}
          <Transaction resp={trans} navigation={props.navigation} />
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
  );
}

// The Income component
const Income = ({
  navigation,
  incomeBalance,
}: {
  incomeBalance: number;
  navigation: any;
}) => {
  // Getting the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Income")}
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
      className="flex-col space-y-2 flex justify-center py-7 px-5 rounded-2xl items-start"
    >
      <View className="flex flex-row justify-center space-x-4 items-center">
        <SimpleLineIcons name="graph" size={28} color="rgb(22 163 74)" />
        <Text className="text-2xl font-bold tracking-widest">Income</Text>
      </View>
      <View className="flex justify-center items-start">
        <Text className="">£ {incomeBalance}</Text>
        {/* <Text className="font-bold tracking-widest text-green-600">+ 12%</Text> */}
      </View>
    </TouchableOpacity>
  );
};

// The Outcome component
const Outcome = ({
  navigation,
  outcomeBalance,
}: {
  outcomeBalance: number;
  navigation: any;
}) => {
  // Getting the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Spending")}
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
      className="flex-col space-y-2 flex justify-center py-7 px-3 rounded-2xl items-start"
    >
      <View className="flex flex-row justify-center space-x-4 items-center">
        <SimpleLineIcons name="graph" size={28} color="rgb(185 28 28)" />
        <Text className="text-2xl font-bold tracking-widest">Spending</Text>
      </View>
      <View className="flex justify-center items-start">
        <Text className="">£ {outcomeBalance}</Text>
        {/* <Text className="text-red-700 font-bold tracking-widest">- 12%</Text> */}
      </View>
    </TouchableOpacity>
  );
};
