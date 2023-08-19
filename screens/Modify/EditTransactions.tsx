import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  useColorScheme,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useEffect, useRef, useState } from "react";
import { Snackbar } from "react-native-paper";
import { useFirestore } from "../../firebase/useFirestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { reload } from "../../store/slices/reloadSlice";
import { triggerNotifications } from "../../utils/Notifications";
import { OnlyNumbers } from "../../constants/Validations";
import RenderAmount from "../../components/RenderAmount";
import LinearGradient from "react-native-linear-gradient";

const height = Dimensions.get("window").height;

interface Payload {
  date?: string;
  amount?: string;
  description?: string;
  category?: string;
  plan?: string;
  id: string;
  planId?: string;
  planCurrentAmount?: string;
}

export default function EditTransactions(props: any) {
  // Initialize the router and colorScheme
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  // refs for category and plans
  const refC = useRef<TextInput>(null); // ref for categories
  const refP = useRef<TextInput>(null); // ref for plans

  // Retrieve initial state from local search params
  const params = props.route.params;
  const initialState: Payload = {
    description: `${params.description}`,
    date: `${params.date}`,
    amount: `${params.amount}`,
    id: params.id,
    category: params.category,
    plan: params.plan,
  };

  // State variables for edit mode and payload
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);
  const [payload, setPayload] = useState<Payload>(initialState);
  const [categories, setCategories] = useState<Array<any>>();
  const [plans, setPlans] = useState<Array<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlanIdError, setIsPlanIdError] = useState<boolean>(false);
  const [whichOne, setWhichOne] = useState<number>(0); // 1 for category and 2 for plan

  BackHandler.addEventListener("hardwareBackPress", () => {
    isEditMode ? setToggleSnackbar(true) : props.navigation.goBack();
    return true;
  });

  // loading hooks to add - get document
  const { updateDocument } = useFirestore("transactions", user.uid!);
  const { getDocument: getCategories } = useFirestore("categories", user.uid!);
  const { getDocument: getPlans, updateDocument: updatePlan } = useFirestore(
    "plans",
    user.uid!
  );

  // update function
  async function onUpdate() {
    if (
      (payload.planId !== undefined && payload.planId.trim() !== "") ||
      payload.category?.trim() !== ""
    ) {
      if (+payload?.amount! >= 1 && payload?.description!.length >= 1) {
        await updateDocument(
          {
            amount: +payload?.amount!,
            description: payload?.description,
            category: payload.category,
            plan: payload.plan,
          },
          params.id
        ).then(async () => {
          if (payload?.plan !== undefined && payload?.plan?.trim() !== "") {
            await updatePlan(
              {
                currentAmount:
                  +params?.amount < +payload?.amount!
                    ? +payload?.planCurrentAmount! + 1
                    : +payload?.planCurrentAmount! - 1,
              },
              payload?.planId!
            ).then(() => {
              // setIncomeOrSpend(null);
            });
          }
          props.navigation.goBack();
          triggerNotifications("Transaction updated", null);
          dispatch(reload());
        });
      }
    } else {
      setIsPlanIdError(true);
    }
  }

  // loading categories and plans
  const load = async () => {
    try {
      setLoading(true);
      getCategories().then((doc) => setCategories(doc?.docs));
      getPlans().then((doc) => setPlans(doc?.docs));
      setLoading(false);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height,
        }}
      >
        {/* Banner image */}
        <View style={{ width: "100%", height: height / 3 }}>
          <LinearGradient
            start={{ x: 0.0, y: 0.15 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={["#ffbf79", "#adfbd6"]}
            className="flex-1 justify-start items-start flex-col"
          >
            <View className="justify-between w-full items-center flex-row px-3 pt-3">
              {/* Back button */}
              <TouchableOpacity
                className="py-4 px-2"
                onPress={() => {
                  isEditMode
                    ? setToggleSnackbar(true)
                    : props.navigation.goBack();
                }}
              >
                <Ionicons name="chevron-back-sharp" size={26} color="black" />
              </TouchableOpacity>
              {/* Edit button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isEditMode
                    ? "rgba(0, 0, 0, 0.17)"
                    : "transparent",
                }}
                className="py-3 px-4 rounded-full"
                onPress={() => setIsEditMode(!isEditMode)}
              >
                <Octicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {/* Transaction details */}
            <View className="flex justify-center items-start w-full space-y-2 pl-6 mt-4">
              <FlatList
                data={[payload.amount]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View>
                    <Text className="text-black text-xl flex justify-start item">
                      {payload.description}
                    </Text>
                    <Text className="text-black text-3xl font-bold">
                      <RenderAmount amount={+item!} />
                    </Text>
                    <Text className="text-black text-sm">{payload.date}</Text>
                  </View>
                )}
                keyExtractor={() => `1`}
              />
            </View>
          </LinearGradient>
        </View>
        {/* Editable fields */}
        <View className="px-3 space-y-3 py-5 pb-10">
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">
              Description
            </Text>
            <TextInput
              className="py-2 px-3 rounded-lg dark:text-white"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="Description"
              keyboardType="default"
              showSoftInputOnFocus={isEditMode}
              onChangeText={(description) =>
                setPayload({ ...payload, description })
              }
              value={payload.description}
            />
          </View>
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">
              Amount
            </Text>
            <TextInput
              className="py-2 px-3 rounded-lg dark:text-white"
              value={payload.amount}
              onChangeText={(amount) => {
                if (OnlyNumbers(amount)) setPayload({ ...payload, amount });
              }}
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="0"
              placeholderTextColor="grey"
              keyboardType="numeric"
              showSoftInputOnFocus={isEditMode}
            />
          </View>
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">
              Category
            </Text>
            <TextInput
              ref={refC}
              onBlur={() => setWhichOne(0)}
              onFocus={() => setWhichOne(1)}
              className="py-2 px-3 rounded-lg dark:text-white"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g Rent"
              keyboardType="default"
              showSoftInputOnFocus={false}
              onChangeText={(category) => setPayload({ ...payload, category })}
              value={
                payload?.category !== undefined &&
                payload?.category.trim() !== "" &&
                payload?.category.trim() !== "#income"
                  ? payload.category
                  : ""
              }
            />
            {/* Selection */}
            {isEditMode &&
              payload?.category !== undefined &&
              payload?.category.trim() !== "" &&
              payload?.category.trim() !== "#income" && (
                <View
                  className="py-2 space-y-1"
                  style={{ display: whichOne === 1 ? "flex" : "none" }}
                >
                  {categories?.length === 0 && (
                    <Text
                      className="text-base text-center font-semibold"
                      style={{ color: Colors[colorScheme ?? "light"].text }}
                    >
                      No category.
                    </Text>
                  )}
                  {categories?.map((e, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        refC.current?.blur();
                        refP.current?.clear();
                        setWhichOne(0);
                        setPayload({
                          ...payload,
                          category: e._data.code,
                        });
                      }}
                      key={i}
                      style={{ borderWidth: 1, borderColor: "gray" }}
                      className="rounded-lg px-2 py-2 flex flex-row justify-start items-center"
                    >
                      <Text className="text-base font-semibold tracking-wider">
                        {e._data.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>
          <View>
            <Text className="font-semibold text-base text-red-500">(OR)</Text>
          </View>
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">Plan</Text>
            <TextInput
              ref={refP}
              onBlur={() => setWhichOne(0)}
              onFocus={() => setWhichOne(2)}
              className="py-2 px-3 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="Choose..."
              placeholderTextColor="grey"
              keyboardType="default"
              showSoftInputOnFocus={false}
              value={
                payload?.plan !== undefined &&
                payload?.plan.trim() !== "" &&
                payload?.plan !== "no-plan" &&
                payload?.plan !== "Deposit"
                  ? payload?.plan
                  : ""
              }
              onChangeText={(plan) => {
                setPayload({ ...payload, plan });
              }}
            />
            {/* Selection */}
            {isEditMode &&
              payload?.plan !== undefined &&
              payload?.plan.trim() !== "" && (
                <View
                  className="py-2 space-y-1"
                  style={{ display: whichOne === 2 ? "flex" : "none" }}
                >
                  {plans?.length === 0 && (
                    <Text
                      className="text-base text-center font-semibold"
                      style={{ color: Colors[colorScheme ?? "light"].text }}
                    >
                      No plan.
                    </Text>
                  )}
                  {plans?.map((e, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        refP.current?.blur();
                        refC.current?.clear();
                        setWhichOne(0);
                        setPayload({
                          ...payload,
                          plan: e._data.title,
                          category: e._data.category,
                          planId: e.id,
                          planCurrentAmount: e._data.currentAmount,
                        });
                      }}
                      key={i}
                      style={{ borderWidth: 1, borderColor: "gray" }}
                      className="rounded-lg px-2 py-2 flex flex-row justify-start items-center"
                    >
                      <Text className="text-base font-semibold tracking-wider">
                        {e._data.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>

          {/* Change and Cancel buttons */}
          <TouchableOpacity
            onPress={() => onUpdate()}
            disabled={!isEditMode || loading}
            className="flex justify-center items-center rounded-lg"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">Change</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!isEditMode}
            onPress={() => setIsEditMode(false)}
            className="flex justify-center items-center rounded-lg"
            style={{
              backgroundColor:
                Colors[colorScheme ?? "light"].secondaryBackground,
            }}
          >
            <Text
              style={{ color: Colors[colorScheme ?? "light"].text }}
              className="text-white py-3"
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "10%" }}
        visible={toggleSnackbar}
        onDismiss={() => setToggleSnackbar(false)}
        action={{
          label: "Yes",
          onPress: () => {
            props.navigation.goBack();
          },
        }}
      >
        Are you sure?
      </Snackbar>
      <Snackbar
        style={{ marginBottom: "10%" }}
        visible={isPlanIdError}
        onDismiss={() => setIsPlanIdError(false)}
      >
        Reselect plan
      </Snackbar>
    </SafeAreaView>
  );
}
