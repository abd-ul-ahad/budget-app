import {
  // React Native components
  View,
  Dimensions,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  useColorScheme,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons, Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
import { ToWords } from "to-words";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { useFirestore } from "../firebase/useFirestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { set } from "../store/slices/snackSlice";
import { reload } from "../store/slices/reloadSlice";

const image = require("../assets/images/banner.png");

const height = Dimensions.get("window").height;

interface Payload {
  title?: string;
  date?: string;
  amount?: string;
  description?: string;
  category?: string;
  id: string;
}

export default function EditTransactions(props: any) {
  // Initialize the router and colorScheme
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const toWords = new ToWords();

  // Retrieve initial state from local search params
  const { amount, date, title, id } = props.route.params;
  const initialState: Payload = {
    title: `${title}`,
    date: `${date}`,
    amount: `${amount}`,
    id,
  };

  console.log(id);

  // State variables for edit mode and payload
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);
  const [payload, setPayload] = useState<Payload>(initialState);

  BackHandler.addEventListener("hardwareBackPress", () => {
    isEditMode ? setToggleSnackbar(true) : props.navigation.goBack();
    return true;
  });

  const { updateDocument } = useFirestore("transactions", user.uid!);

  async function onUpdate() {
    console.log(id);

    if (payload?.amount!.length >= 1 && payload?.title!.length >= 1) {
      await updateDocument(
        {
          amount: +payload?.amount!,
          description: payload?.title,
        },
        id
      ).then(() => {
        console.log("updated");
        props.navigation.goBack();
        dispatch(set({ toggle: true, msg: "Transaction updated" }));
        dispatch(reload());
      });
    }
  }

  return (
    // SafeAreaView provides padding to avoid notches or other elements overlapping content
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height,
        }}
      >
        {/* Banner image */}
        <View style={{ width: "100%", height: height / 3 }}>
          <ImageBackground
            source={image}
            resizeMode="cover"
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
                <Ionicons name="chevron-back-sharp" size={26} color="white" />
              </TouchableOpacity>
              {/* Edit button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isEditMode ? "#3c7250" : "transparent",
                }}
                className="py-3 px-4 rounded-full"
                onPress={() => setIsEditMode(!isEditMode)}
              >
                <Octicons name="pencil" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {/* Transaction details */}
            <View className="flex justify-center items-start w-full space-y-2 pl-6 mt-4">
              <FlatList
                data={[amount]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View>
                    <Text className="text-white text-xl flex justify-start item">
                      {title}
                    </Text>
                    <Text className="text-white text-3xl font-bold">
                      £ {item}
                    </Text>
                    <Text className="text-white text-sm">
                      {toWords.convert(+item!)} Pounds
                    </Text>
                    <Text className="text-white text-sm">{date}</Text>
                  </View>
                )}
                keyExtractor={() => `1`}
              />
            </View>
          </ImageBackground>
        </View>
        {/* Editable fields */}
        <View className="px-3 space-y-3 py-5 pb-10">
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">
              Source
            </Text>
            <TextInput
              className="py-2 px-3 rounded-lg dark:text-white"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g Salary"
              keyboardType="default"
              showSoftInputOnFocus={isEditMode}
              onChangeText={(title) => setPayload({ ...payload, title })}
              value={payload.title}
            />
          </View>
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
              Category
            </Text>
            <TextInput
              className="py-2 px-3 rounded-lg dark:text-white"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g Rent"
              keyboardType="default"
              showSoftInputOnFocus={isEditMode}
              onChangeText={(category) => setPayload({ ...payload, category })}
              value={payload.category}
            />
          </View>
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">
              Amount
            </Text>
            <TextInput
              className="py-2 px-3 rounded-lg dark:text-white"
              value={payload.amount}
              onChangeText={(amount) => setPayload({ ...payload, amount })}
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="0"
              placeholderTextColor="grey"
              keyboardType="numeric"
              showSoftInputOnFocus={isEditMode}
            />
          </View>
          {/* Change and Cancel buttons */}
          <TouchableOpacity
            onPress={() => onUpdate()}
            disabled={!isEditMode}
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
    </SafeAreaView>
  );
}
