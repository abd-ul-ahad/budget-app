import {
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

export default function DailySavings(props: any) {
  const colorScheme = useColorScheme();
  const balances = useSelector((state: RootState) => state.balances);
  const user = useSelector((state: RootState) => state.user);

  //
  const [saveAmount, setSaveAmount] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [dailySaving, setDailySaving] = useState<number>();
  const [daily, setDaily] = useState<number>();
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  const load = async () => {
    try {
      let value = await AsyncStorage.getItem(
        "savings-budget-app" + user.uid?.slice(0, 7)
      );
      if (value != null) {
        const { saveAmount } = JSON.parse(value);
        const per = ((balances.currentBalance / 30) * +saveAmount) / 100;

        setDaily((balances.currentBalance / 30) - per);

        setDailySaving(per);
        setSaveAmount(saveAmount);
      } else {
        setDailySaving(0);
        setDaily(balances.currentBalance / 30);
      }
    } catch (e) {
      setDailySaving(0);
      setDaily(balances.currentBalance / 30);
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
        daily != undefined && setDaily(daily - per);

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
            Daily savings
          </Text>
        </View>
        <View>
          <View className="w-full pt-8 pb-16 space-y-1">
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
                style={{ color: "#767676" }}
                className="dark:text-white text-start text-xl font-semibold"
              >
                Daily
              </Text>
              <Text className="px-4 font-bold text-xl text-center tracking-widest">
                <RenderAmount amount={+(daily || 0).toFixed(2) || 0} />
              </Text>
            </View>
            {/*  */}
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676" }}
                className="dark:text-white text-start text-xl font-semibold"
              >
                Weekly
              </Text>
              <Text className="px-4 font-bold text-xl text-center tracking-widest">
                <RenderAmount
                  amount={+(balances.currentBalance / 4).toFixed(2) || 0}
                />
              </Text>
            </View>
          </View>
          <View className="pt-6 px-5 space-y-3">
            <View className="flex flex-row justify-between items-center">
              <Text
                style={{ color: "#767676" }}
                className="dark:text-white text-start text-xl font-semibold"
              >
                Saving
              </Text>
              <Text className="px-4 font-bold text-xl text-center tracking-widest">
                <RenderAmount amount={+(dailySaving || 0).toFixed(3) || 0} />
              </Text>
            </View>
          </View>
          <View className="px-5 pt-4">
            <View className="pb-3">
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