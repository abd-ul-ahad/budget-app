import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import RenderAmount from "../../components/RenderAmount";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const height = Dimensions.get("window").height;

export default function DailySavings(props: any) {
  const colorScheme = useColorScheme();
  const balances = useSelector((state: RootState) => state.balances);
  const user = useSelector((state: RootState) => state.user);

  //
  const [saveAmount, setSaveAmount] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [dailySaving, setDailySaving] = useState<number>();
  const [daily, setDaily] = useState<number>();
  const [weekly, setWeekly] = useState<number>();
  const [weeklySaving, setWeeklySaving] = useState<number>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  const load = async () => {
    try {
      setDaily(balances.currentBalance / 30);
      let value = await AsyncStorage.getItem(
        "savings-budget-app" + user.uid?.slice(0, 7)
      );
      if (value != null) {
        const { saveAmount } = JSON.parse(value);
        const per = ((balances.currentBalance / 30) * +saveAmount) / 100;

        setDaily(balances.currentBalance / 30 - per);
        setWeekly((balances.currentBalance / 30 - per) * 7);
        setDailySaving(per);
        setSaveAmount(saveAmount);
        setWeeklySaving(per * 7);
      } else {
        setDailySaving(0);
        setDaily(balances.currentBalance / 30);
        setWeekly(balances.currentBalance / 4);
        setWeeklySaving(0);
      }
    } catch (e) {
      setDailySaving(0);
      setDaily(balances.currentBalance / 30);
      setWeekly(balances.currentBalance / 4);
      setWeeklySaving(0);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (+saveAmount >= 0 && +saveAmount <= 100) {
        const per = ((balances.currentBalance / 30) * +saveAmount) / 100;

        setDailySaving(per);
        setWeekly((balances.currentBalance / 30 - per) * 7);
        daily != undefined && setDaily(balances.currentBalance / 30 - per);
        setWeeklySaving(per * 7);

        if (daily != undefined) {
          const jsonValue = JSON.stringify({
            saveAmount: saveAmount,
          });

          await AsyncStorage.setItem(
            "savings-budget-app" + user.uid?.slice(0, 7),
            jsonValue
          );
        }
      } else {
        setOpenSnackbar({ open: true, msg: "Invalid percentage" });
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View className="flex-row flex mt-2 justify-start items-center">
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={height > 630 ? 26 : 20}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text
            style={{ fontSize: 20 }}
            className="flex-1 pl-3 font-bold tracking-wider text-start py-2"
          >
            Daily savings
          </Text>
        </View>
        <View>
          <View style={{ paddingVertical: 50 }} className="w-full space-y-1">
            <Text className="px-4 font-bold text-3xl w-full text-center tracking-widest">
              <RenderAmount amount={balances.currentBalance || 0} />
            </Text>
            <Text
              style={{ color: "#767676" }}
              className="dark:text-white text-center w-full text-xl font-semibold"
            >
              Income
            </Text>
          </View>
          <View className="px-5 space-y-3 pt-4">
            {/*  */}
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Allow to spend a day
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(daily || 0).toFixed(2) || 0} />
              </Text>
            </View>
            {/*  */}
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Allow to spend a week
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(weekly || 0).toFixed(2) || 0} />
              </Text>
            </View>
          </View>
          <View className="pt-3 px-5 space-y-3">
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Daily saving
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(dailySaving || 0).toFixed(2) || 0} />
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676", fontSize: height > 630 ? 19 : 17 }}
                className="dark:text-white text-start font-semibold"
              >
                Weekly saving
              </Text>
              <Text
                style={{ fontSize: height > 630 ? 19 : 17 }}
                className="px-4 font-bold text-center tracking-widest"
              >
                <RenderAmount amount={+(weeklySaving || 0).toFixed(2) || 0} />
              </Text>
            </View>
          </View>
          <View className="px-5 pt-4">
            <View className="pb-3">
              <Text
                style={{ color: "#767676" }}
                className="dark:text-white text-start text-base font-semibold pb-1"
              >
                Daily percentage savings
              </Text>
              <TextInput
                className="py-2 px-3 dark:text-white rounded-lg"
                style={{ borderColor: "grey", borderWidth: 2 }}
                placeholder="0"
                placeholderTextColor="grey"
                keyboardType="numeric"
                value={saveAmount >= "0" ? `${saveAmount}` : ""}
                onChangeText={(text) => {
                  setSaveAmount(text);
                }}
              />
            </View>
            <TouchableOpacity
              disabled={loading}
              onPress={() => onSubmit()}
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">
                {loading ? "Loading..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-5 pt-5 pb-10">
          <Text
            style={{
              color: "#767676",
              fontSize: height > 630 ? 19 : 16,
              lineHeight: height > 630 ? 30 : 25,
            }}
            className="dark:text-white w-full text-center font-semibold pb-1 px-3"
          >
            By consistently saving {saveAmount}% each day, you can accumulate
            savings of{" "}
            <RenderAmount amount={+(dailySaving || 0).toFixed(2) || 0} /> daily
            and {"\n"}{" "}
            <RenderAmount amount={+(weeklySaving || 0).toFixed(2) || 0} />{" "}
            weekly.
          </Text>
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
