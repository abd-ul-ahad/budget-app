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

export default function EditSavings(props: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const params = props.route.params;

  // state
  const [amount, setAmount] = useState<number>(0);
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
      if (amount > 0) {
        await updateDocument(
          {
            currentAmount: amount,
          },
          params.id
        ).then(() => {
          triggerNotifications(`Update ${amount} £ to Savings.`, null);
          dispatch(reload());
        });
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
        triggerNotifications(`Removed ${amount} £ from Savings.`, null);
        props.navigation.goBack();
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
        <View className="flex-row flex mt-6 justify-start items-center">
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
        </View>

        <View className="px-3 mt-10">
          <Text className="dark:text-white text-lg font-semibold">
            Save Amount
          </Text>
          <TextInput
            className="py-2 px-3 dark:text-white rounded-lg mt-1"
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
            onPress={() => onUpdate()}
            className="flex justify-center items-center rounded-lg mt-5"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {loading ? "Loading..." : "Update"}
            </Text>
          </TouchableOpacity>
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
