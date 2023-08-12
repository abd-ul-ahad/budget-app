import { SafeAreaView, TextInput, useColorScheme } from "react-native";
import WaveChart from "../../components/WaveChart";
import Colors from "../../constants/Colors";
import { ScrollView } from "react-native";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { useFirestore } from "../../firebase/useFirestore";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { triggerNotifications } from "../../utils/Notifications";
import calculateSavingsByMonth from "../../utils/Savings";

export default function Savings(props: any) {
  const colorScheme = useColorScheme();

  // from redux
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);

  // state variables
  const [loading, setLoading] = useState<boolean>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });
  const [amount, setAmount] = useState<number>(0);
  //
  const [allSavings, setAllSavings] = useState<Array<any>>();
  const [currentMonthSavings, setCurrentMonthSavings] = useState<{
    currentAmount: number;
    targetAmount: number;
    month: string;
  }>({ targetAmount: 0, currentAmount: 0, month: "" });

  //
  const { addDocument, getDocument } = useFirestore("savings", user.uid!);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (amount > 0) {
        addDocument({ currentAmount: amount, targetAmount: amount }).then(
          () => {
            triggerNotifications(`${amount} £ to Savings.`, null);
          }
        );
      } else {
        setOpenSnackbar({ open: true, msg: "Invalid amount." });
      }
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }

    setLoading(false);
  };

  // loading savings
  useEffect(() => {
    (async function () {
      getDocument()
        .then((doc) => {
          setAllSavings(doc?.docs);
          setCurrentMonthSavings(calculateSavingsByMonth(doc?.docs));
        })
        .catch(() => {
          setOpenSnackbar({ open: true, msg: "Error please start app." });
        });
    })();
  }, [reloadState]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ScrollView>
        <View className="flex-row flex mt-6 justify-start items-center">
          <TouchableOpacity
            className="py-4 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text className="text-2xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Savings
          </Text>
        </View>
        <View className="px-3 mt-3 space-y-2">
          <Text className="dark:text-white text-lg font-semibold">
            Save Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={amount === 0 ? "" : `${amount}`}
            onChangeText={(text) => {
              var numberRegex = /^\d+$/;
              if (numberRegex.test(text)) setAmount(+text);
            }}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={() => onSubmit()}
            className="flex justify-center items-center rounded-lg mt-5"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex pl-3 flex-row justify-between items-center mt-4">
          <View>
            <Text className="text-xl font-bold tracking-wider">This month</Text>
            <Text className="text-base tracking-wider">
              ( {currentMonthSavings.month} )
            </Text>
          </View>
          <TouchableOpacity className="flex flex-row justify-between items-center py-2 px-3">
            <Text className="text-base text-red-600 font-semibold tracking-wider">
              All
            </Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="rgb(220, 38, 38)"
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 800 }}>
          <WaveChart
            level={
              (currentMonthSavings.currentAmount /
                currentMonthSavings.targetAmount) *
              100
            }
          />
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={openSnackbar.open}
        onDismiss={() => setOpenSnackbar({ ...openSnackbar, open: false })}
      >
        {openSnackbar.msg}
      </Snackbar>
    </SafeAreaView>
  );
}
