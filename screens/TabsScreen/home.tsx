import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/index";
import Hero from "../../components/Hero";
import Transaction from "../../components/Transaction";
import Colors from "../../constants/Colors";
import { Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { Text } from "../../components/Themed";
import { FadeInView } from "../../components/animations";
import Single from "../../components/plan/Single";

// Getting the width of the window
const width = Dimensions.get("window").width;

export default function Home(props: any) {
  // Getting the user data from the Redux store
  const user = useSelector((state: RootState) => state.user);
  // Getting the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
      <FadeInView _duration={400}>
        {/* ScrollView to enable scrolling */}
        <ScrollView
          style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
        >
          {/* Hero component */}
          <Hero />

          {/* Income and Outcome components */}
          {/* <FlatList
            className="my-6 px-3"
            data={[
              { id: 1, e: <Income navigation={props.navigation} /> },
              { id: 2, e: <Outcome navigation={props.navigation} /> },
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <View key={item.id}>{item.e}</View>}
            keyExtractor={(item) => `${item.id}`}
          /> */}

          <View className="flex flex-row items-center justify-between px-4 py-4">
            <Income navigation={props.navigation} />
            <Outcome navigation={props.navigation} />
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

            {/* FlatList to display plan cards */}
            <FlatList
              className="mt-6 px-1"
              data={[{ id: 1 }]}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={() => (
                <TouchableOpacity
                  className="px-2 rounded-xl mr-10 py-4"
                  onPress={() => {
                    props.navigation.navigate("EditPlan", {
                      title: "Title",
                      category: "Category",
                      amount: "99",
                    });
                  }}
                  style={{
                    width: width / 2,
                    backgroundColor:
                      Colors[colorScheme ?? "light"].secondaryBackground,
                  }}
                >
                  <Single />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => `${item.id}`}
            />
          </View>

          {/* Transaction component */}
          <Transaction navigation={props.navigation} />
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}

// The Income component
const Income = ({ navigation }: { navigation: any }) => {
  // Getting the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Income")}
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
      className="flex-col space-y-2 flex justify-center py-7 px-3 rounded-2xl items-start"
    >
      <View className="flex flex-row justify-center space-x-4 items-center">
        <SimpleLineIcons
          name="graph"
          size={28}
          color={Colors[colorScheme ?? "light"].text}
        />
        <Text className="text-2xl font-bold tracking-widest">Income</Text>
      </View>
      <View className="flex justify-center items-start">
        <Text className="">£ 100000</Text>
        <Text className="font-bold tracking-widest text-green-600">+ 12%</Text>
      </View>
    </TouchableOpacity>
  );
};

// The Outcome component
const Outcome = ({ navigation }: { navigation: any }) => {
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
        <SimpleLineIcons
          name="graph"
          size={28}
          color={Colors[colorScheme ?? "light"].text}
        />
        <Text className="text-2xl font-bold tracking-widest">Spending</Text>
      </View>
      <View className="flex justify-center items-start">
        <Text className="">£ 100000</Text>
        <Text className="text-red-700 font-bold tracking-widest">- 12%</Text>
      </View>
    </TouchableOpacity>
  );
};
