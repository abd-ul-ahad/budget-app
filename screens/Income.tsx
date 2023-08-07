import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Single } from "../components/Transaction";
import { LineGraph } from "../components/LineGraph";
import { FadeInView } from "../components/animations";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useFirestore } from "../firebase/useFirestore";
import formattedDate from "../utils/FormatDate";

// The main functional component "Income"
export default function Income(props: any) {
  // Initialize the router and colorScheme using the provided hooks
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);

  const { getDocument } = useFirestore("transactions", user.uid!);

  const [resp, setResp] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      console.log(e);
      if (e._data.category === "#income") r.push(e);
    });

    setResp(r);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    // Render the SafeAreaView to ensure content is properly displayed within device safe areas
    <SafeAreaView>
      {/* Apply the FadeInView animation to create a fade-in effect */}
      <FadeInView _duration={700}>
        {/* Create a scrollable area using ScrollView */}
        <ScrollView
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: "100%",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} />
          }
        >
          {/* A container View with some flex styles */}
          <View className="pt-2 flex justify-center items-start">
            {/* Container with flex styles to position elements */}
            <View className="pt-2 flex justify-between flex-row items-center w-full">
              {/* TouchableOpacity with a back button, triggering the "router.back()" function */}
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
              {/* TouchableOpacity with a bell icon */}
              <TouchableOpacity className="py-4 px-4">
                <Feather
                  name="bell"
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
            </View>
            {/* Text displaying the title "Income" */}
            <Text className="text-xl font-semibold tracking-wider text-start w-full pl-2 py-4">
              Income
            </Text>
            {/* Render the LineGraph component */}
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
          {/* Container View with some padding */}
          <View className="pt-2">
            {/* Text displaying the title "Transactions" */}
            <Text className="text-xl font-semibold tracking-wider pl-2">
              Transactions
            </Text>
            {/* View containing a list of transactions */}
            <View>
              <View className="px-2 pt-2 pb-7">
                {/* Loop through an array and render the "Single" component with transaction details */}
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
              </View>
            </View>
          </View>
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}
