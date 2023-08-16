import { ProgressBar } from "react-native-paper";
import { Text, View } from "./Themed";
import {
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";

const width = Dimensions.get("window").width;

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  return (
    <View className="px-2 mb-5">
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold dark:text-white">Savings</Text>
        <TouchableOpacity
          className="px-1 py-1"
          onPress={() => props.navigation.navigate("Savings")}
        >
          <Entypo
            name="chevron-right"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>
      {props.savings?.length === 0 ? (
        <Text className="w-full text-center pb-2 mt-2">No savings</Text>
      ) : (
        <FlatList
          className="mt-2 px-1"
          data={props?.savings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._data.createdAt?.seconds}`}
          renderItem={(e: any) => {
            const { currentAmount, monthYear, targetAmount } =
              formatDateAndAmounts(e.item._data);

            return (
              <Single
                id={e.item.id}
                navigation={props.navigation}
                currentAmount={`${currentAmount}`}
                month={monthYear}
                amount={targetAmount}
                progress={
                  currentAmount !== 0 || targetAmount !== 0
                    ? currentAmount / targetAmount
                    : 0
                }
              />
            );
          }}
        />
      )}
    </View>
  );
}

export const Single = ({
  month,
  amount,
  progress,
  id,
  navigation,
  currentAmount,
}: {
  currentAmount?: string;
  month: string;
  amount: number;
  progress: number;
  id: string;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation !== null &&
        navigation.navigate("EditSavings", {
          id,
          month,
          amount,
          progress,
          currentAmount,
        })
      }
      className="px-3 rounded-xl mr-10 py-4"
      style={{
        width: width - 30,
        backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
      }}
    >
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
        }}
        className="flex flex-row justify-between items-center pb-2"
      >
        <Text className="text-start text-lg font-bold tracking-widest">
          {month}
        </Text>
        <Text
          style={{ color: "#767676" }}
          className="text-start text-base font-semibold tracking-widest"
        >
          {((Number(currentAmount) / amount) * 100).toFixed(1) || 0} %
        </Text>
      </View>
      <View className="w-full">
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].secondaryBackground,
          }}
          className="w-full pb-1 flex flex-row justify-between items-center"
        >
          <Text className="text-base font-semibold tracking-widest">
            £ {currentAmount}
          </Text>
          <Text className="text-base font-semibold tracking-widest">
            £ {amount}
          </Text>
        </View>
        <ProgressBar
          style={{ height: 10 }}
          progress={progress}
          className="rounded-full"
          theme={{
            colors: {
              primary: "#fdd300",
            },
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

function formatDateAndAmounts(data: any) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const createdAt = new Date(data.createdAt.seconds * 1000);
  const monthYear = `${
    months[createdAt.getMonth()]
  } ${createdAt.getFullYear()}`;
  const targetAmount = data.targetAmount;
  const currentAmount = data.currentAmount;

  return { monthYear, targetAmount, currentAmount };
}
