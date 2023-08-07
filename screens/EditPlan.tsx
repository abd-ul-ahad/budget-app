// Import necessary components and libraries
import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Text, View } from "../components/Themed";
import { FadeInView } from "../components/animations";
// import { useLocalSearchParams } from "expo-router";
// import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useFirestore } from "../firebase/useFirestore";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const height = Dimensions.get("window").height;

interface Payload {
  title: string;
  amount: string;
  category: string;
  code: string;
}

// Define the EditPlan component
export default function EditPlan(props: any) {
  const ref = useRef<TextInput>(null);
  // Get the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  const user = useSelector((state: RootState) => state.user);
  const { getDocument } = useFirestore("categories", user.uid!);
  const { addDocument } = useFirestore("plans", user.uid!);

  // Extract the title, amount, and category from local search parameters
  const { title, amount, category } = props.route.params;

  const [payload, setPayload] = useState<Payload>({
    title: `${title === 0 ? "" : title}`,
    amount,
    category,
    code: "",
  });

  const [toggle, setToggle] = useState<boolean>(false);
  const [categories, setCategories] =
    useState<Array<{ description: string; code: string }>>();
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    const d = await getDocument();
    let r: any = [];
    d?.forEach((e: any) => {
      r.push({ description: e._data.description, code: e._data.code });
    });

    setCategories(r);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [toggle]);

  const onAddSubmit = async () => {
    if (
      payload.category.length >= 1 &&
      payload.amount.length >= 1 &&
      payload.title.length >= 1
    ) {
      setLoading(true);
      const d = addDocument({
        category: payload?.code,
        budgetAmount: payload?.amount,
        title: payload?.title,
        currentAmount: 0
      }).then(() => setToggle(false));
      props.navigation.goBack();
      setLoading(false);
    }
  };

  return (
    // Wrap the content in a SafeAreaView to avoid overlapping with the device's safe area
    <SafeAreaView>
      {/* Use the custom FadeInView component to apply fade-in animation */}
      <FadeInView _duration={150}>
        {/* Main content container */}
        <ScrollView>
          <View
            style={{
              // Apply background color based on the color scheme
              backgroundColor:
                colorScheme === "light"
                  ? "rgba(0, 0, 0, 0.2)" // Light mode background color
                  : "rgba(255, 255, 255, 0.2)", // Dark mode background color
            }}
            className="w-full flex justify-center items-center h-screen py-4 px-2"
          >
            {/* Content wrapper */}
            <View className="rounded-xl w-full pb-10 px-4 pt-8">
              {/* Header section */}
              <View
                style={{ backgroundColor: "transparent" }}
                className="flex flex-row justify-between items-center"
              >
                {/* Display the title as "New Plan" or show an edit icon */}
                <Text className="dark:text-white text-lg font-semibold">
                  {+title !== 0 ? ( // +(string) = number
                    <Octicons
                      name="pencil"
                      size={24}
                      color={Colors[colorScheme ?? "light"].text}
                    />
                  ) : (
                    "New Plan"
                  )}
                </Text>
                {/* Close button to navigate back */}
                <TouchableOpacity
                  className="px-1 py-1"
                  onPress={() => props.navigation.goBack()}
                >
                  <Ionicons
                    name="close-sharp"
                    size={30}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                </TouchableOpacity>
              </View>

              {/* Title input section */}
              <View className="space-y-1 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Title
                </Text>
                {/* TextInput for entering the title */}
                <TextInput
                  className="py-2 px-3 dark:text-white rounded-lg"
                  style={{ borderColor: "grey", borderWidth: 2 }}
                  placeholder="e.g London Tour"
                  value={payload?.title}
                  placeholderTextColor="grey"
                  keyboardType="default"
                  onChangeText={(title) => setPayload({ ...payload, title })}
                />
              </View>

              {/* Budget amount input section */}
              <View className="space-y-1 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Budget Amount <Text className="text-sm">(Limit: 10000)</Text>
                </Text>
                {/* TextInput for entering the budget amount */}
                <TextInput
                  className="py-2 px-3 dark:text-white rounded-lg"
                  style={{ borderColor: "grey", borderWidth: 2 }}
                  placeholder="0"
                  value={payload?.amount}
                  placeholderTextColor="grey"
                  keyboardType="default"
                  onChangeText={(amount) => setPayload({ ...payload, amount })}
                />
              </View>

              {/* Category selection input section */}
              <View className="space-y-1 pb-3 pt-5">
                <Text className="dark:text-white text-lg font-semibold">
                  Choose Category
                </Text>
                {/* TextInput for choosing the category */}
                <TextInput
                  ref={ref}
                  onBlur={() => setToggle(false)}
                  onFocus={() => setToggle(true)}
                  className="py-2 px-3 dark:text-white rounded-lg"
                  style={{ borderColor: "grey", borderWidth: 2 }}
                  placeholder="Choose..."
                  placeholderTextColor="grey"
                  keyboardType="default"
                  showSoftInputOnFocus={false}
                  value={payload?.category}
                  onChangeText={(category) => {
                    setPayload({ ...payload, category });
                  }}
                />
                <View
                  className="py-2"
                  style={{ display: toggle ? "flex" : "none", height: 100 }}
                >
                  {categories?.map((e, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        ref.current?.blur();
                        setToggle(false);
                        setPayload({
                          ...payload,
                          category: e.description,
                          code: e.code,
                        });
                      }}
                      key={i}
                      className="px-2 py-1 flex flex-row justify-start items-center"
                    >
                      <Text className="text-base font-semibold tracking-wider">
                        {e.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Button to submit the form (Add or Edit) */}
              {+title !== 0 ? (
                <TouchableOpacity
                  disabled={loading}
                  className="flex justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  }}
                >
                  <Text className="text-white py-3">Edit Plan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onAddSubmit()}
                  disabled={loading}
                  className="flex justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  }}
                >
                  <Text className="text-white py-3">Add Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}
