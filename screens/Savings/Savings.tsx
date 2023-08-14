import {
  RefreshControl,
  SafeAreaView,
  TextInput,
  useColorScheme,
} from "react-native";
import WaveChart from "../../components/WaveChart";
import Colors from "../../constants/Colors";
import { ScrollView } from "react-native";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { useFirestore } from "../../firebase/useFirestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { triggerNotifications } from "../../utils/Notifications";
import calculateSavingsByMonth from "../../utils/Savings";
import { reload } from "../../store/slices/reloadSlice";
import { OnlyNumbers } from "../../constants/Validations";

export default function Savings(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  // from redux
  const user = useSelector((state: RootState) => state.user);
  const reloadState = useSelector((state: RootState) => state.reload);
  const { currentBalance } = useSelector((state: RootState) => state.balances);

  // state variables
  const [loading, setLoading] = useState<boolean>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });
  const [amount, setAmount] = useState<number>(0);
  //
  const [allSavings, setAllSavings] = useState<Array<any>>([]);
  const [currentMonthSavings, setCurrentMonthSavings] = useState<{
    currentAmount: number;
    totalSavings: number;
    targetAmount: number;
    month: string;
  }>({ targetAmount: 0, currentAmount: 0, month: "", totalSavings: 0 });

  //
  const { addDocument, getDocument } = useFirestore("savings", user.uid!);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (amount > 0) {
        if (amount <= currentBalance) {
          addDocument({ currentAmount: amount, targetAmount: amount }).then(
            () => {
              triggerNotifications(`${amount} £ to Savings.`, null);
              dispatch(reload());
            }
          );
        } else {
          setOpenSnackbar({ open: true, msg: "Not enough balance." });
        }
      } else {
        setOpenSnackbar({ open: true, msg: "Invalid amount." });
      }
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }

    setLoading(false);
  };

  const load = () => {
    setLoading(true);
    getDocument()
      .then((doc) => {
        doc?.docs !== undefined && setAllSavings(doc?.docs);
        setCurrentMonthSavings(calculateSavingsByMonth(doc?.docs));
      })
      .catch(() => {
        setOpenSnackbar({ open: true, msg: "Error please start app." });
      });
    setLoading(false);
  };

  // loading savings
  useEffect(() => load(), [reloadState]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ScrollView
        style={{ height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={loading!} onRefresh={load} />
        }
      >
        <View className="flex-row flex mt-5 justify-start items-center">
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

        {/*  */}
        <View className="w-full py-8 space-y-1">
          <Text className="px-4 font-bold text-3xl w-full text-center tracking-widest">
            {currentMonthSavings.totalSavings || 0} £
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="dark:text-white text-center w-full text-xl font-semibold"
          >
            Total savings
          </Text>
        </View>
        {/*  */}

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
              if (OnlyNumbers(text)) setAmount(+text);
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
        {allSavings?.length !== 0 ? (
          <>
            <View className="flex pl-3 flex-row justify-between items-center mt-4">
              <View>
                <Text className="text-xl font-bold tracking-wider">
                  This month
                </Text>
                {currentMonthSavings.month && (
                  <Text className="text-base tracking-wider">
                    ( {currentMonthSavings.month} )
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("AllTimeSavings")}
                className="flex flex-row justify-between items-center py-2 px-3"
              >
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
          </>
        ) : (
          <Text className="w-full text-center pb-2 mt-8">No savings</Text>
        )}
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
