import { ScrollView, TextInput, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useState } from "react";
import { useFirestore } from "../../firebase/useFirestore";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "react-native-paper";
import { reload } from "../../store/slices/reloadSlice";
import { triggerNotifications } from "../../utils/Notifications";
import { OnlyNumbers } from "../../constants/Validations";
import RenderAmount from "../../components/RenderAmount";
import getCurrencySymbol from "../../utils/CurrencySymbols";
import LinearGradient from "react-native-linear-gradient";

export default function EditSavings(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { currentBalance } = useSelector((state: RootState) => state.balances);
  const code = useSelector((state: RootState) => state.currency.code);

  //
  const params = props.route.params;

  // state
  const [saveAmount, setSaveAmount] = useState<number>(params.currentAmount);
  const [targetAmount, setTargetAmount] = useState<number>(params.amount);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });

  // importing hooks
  const { updateDocument, deleteDocument } = useFirestore("savings", user.uid!);

  // update
  const onUpdate = async () => {
    try {
      setLoading(true);
      if (
        saveAmount >= 0 &&
        OnlyNumbers(`${saveAmount}`) &&
        OnlyNumbers(`${targetAmount}`)
      ) {
        if (saveAmount <= currentBalance) {
          await updateDocument(
            {
              currentAmount: saveAmount,
              targetAmount: targetAmount,
            },
            params.id
          ).then(() => {
            props.navigation.goBack();
            triggerNotifications(
              `Savings`,
              `Now ${saveAmount} ${getCurrencySymbol(
                code
              )} to ${targetAmount} ${getCurrencySymbol(code)} savings.`
            );
            dispatch(reload());
          });
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

  // delete
  const onDelete = async () => {
    setLoading(true);
    try {
      await deleteDocument(params.id).then(() => {
        triggerNotifications(
          `Savings`,
          `Removed ${saveAmount} ${getCurrencySymbol(code)} from `
        );
        props.navigation.goBack();
        dispatch(reload());
      });
    } catch {
      setOpenSnackbar({ open: true, msg: "Error please try again later." });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: "100%",
        }}
      >
        <View className="flex-row flex mt-2 justify-start items-center">
          <TouchableOpacity
            className="py-3 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Update saving
          </Text>
        </View>

        <View className="w-full mt-6">
          <Text className="w-full text-center text-2xl font-bold tracking-widest">
            {params.month}
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="w-full text-center font-semibold tracking-wider"
          >
            <RenderAmount amount={params.amount} />
          </Text>
          <Text
            style={{ color: "#767676" }}
            className="w-full text-center font-semibold tracking-wider"
          >
            <RenderAmount amount={params.currentAmount} />
          </Text>
        </View>

        <View className="px-3 mt-10">
          <Text className="dark:text-white text-lg font-semibold">
            Goal Amount
          </Text>
          <TextInput
            className="py-2 mb-2 px-3 dark:text-white rounded-lg mt-1"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={targetAmount >= 0 ? `${targetAmount}` : ""}
            onChangeText={(text) => {
              setTargetAmount(+text);
            }}
          />
          <Text className="dark:text-white text-lg font-semibold">
            Save Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg mt-1"
            style={{ borderColor: "grey", borderWidth: 2 }}
            placeholder="0"
            placeholderTextColor="grey"
            keyboardType="numeric"
            value={saveAmount >= 0 ? `${saveAmount}` : ""}
            onChangeText={(text) => {
              setSaveAmount(+text);
            }}
          />
          <LinearGradient
            start={{ x: 0.0, y: 0.15 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={["#ffbf79", "#adfbd6"]}
            className="rounded-lg mt-3"
          >
            <TouchableOpacity
              disabled={loading}
              onPress={() => onUpdate()}
              className="flex justify-center items-center"
            >
              <Text className="text-black font-semibold tracking-wider py-3">
                {loading ? "Loading..." : "Update"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            disabled={loading}
            onPress={() => onDelete()}
            className="flex justify-center bg-red-700 items-center rounded-lg mt-2"
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Delete"}
            </Text>
          </TouchableOpacity>
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
