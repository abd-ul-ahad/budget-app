// Importing necessary components and hooks from React Native and other custom modules
// Note: The actual paths of the components might vary based on the project structure.
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Single } from "../../components/Transaction";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { PieGraph } from "../../components/PieGraph";
import { LineGraph } from "../../components/LineGraph";
import { useFirestore } from "../../firebase/useFirestore";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import formattedDate from "../../utils/FormatDate";

// Function component named "Transaction"
export default function Transaction(props: any) {
  // Using the useColorScheme hook to detect the current color scheme (light/dark) of the device
  const colorScheme = useColorScheme();
  const reloadState = useSelector((state: RootState) => state.reload);

  // Using the useState hook to manage a state variable "labelI" with an initial value of 0
  const [labelI, setLabelI] = useState<number>(0);
  // Getting the user data from the Redux store
  const user = useSelector((state: RootState) => state.user);

  const { getDocument } = useFirestore("transactions", user.uid!);

  const [resp, setResp] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      r.push(e);
    });

    setResp(r);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [reloadState]);

  // JSX code starts here
  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
      >
        {/* Section for displaying the "Savings" data */}
        <View className="pt-2 flex justify-center items-center">
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Savings
          </Text>
          {/* Rendering the LineGraph component with random data */}
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
        </View>

        {/* Section for displaying the "Spending" data */}
        <View className="pt-2 flex justify-center items-center">
          <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
            Spending
          </Text>
          {/* Rendering the PieGraph component */}
          <PieGraph />
        </View>

        {/* Section for displaying "Monthly" and "Yearly" buttons */}
        <View className="flex justify-center items-center flex-row space-x-2 pb-3">
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

        {/* Section for displaying the list of transactions */}
        <View className="pt-2">
          <Text className="text-xl font-semibold tracking-wider pl-2">
            Transactions
          </Text>
          <View>
            {resp?.length === 0 && (
              <Text className="w-full text-center pb-2 mt-2">
                No Transactions
              </Text>
            )}
            <View className="px-2 pt-2 pb-7">
              {/* Rendering multiple instances of the "Single" component with sample data */}
              {resp
                ?.sort(
                  (a: any, b: any) =>
                    b._data.createdAt.seconds - a._data.createdAt.seconds
                )
                .map((e: any, i: number, a: any) => (
                  <Single
                    key={i}
                    id={e.id}
                    title={e._data.description}
                    date={formattedDate(e._data.createdAt)}
                    amount={e._data.amount}
                    isIncome={e._data.category === "#income"}
                    isLast={a.length - 1 === i}
                    navigation={props.navigation}
                    category={e._data.category}
                  />
                ))}
              {/* Other instances of the "Single" component are also rendered here */}
              {/* ... */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
