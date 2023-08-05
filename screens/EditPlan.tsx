// Import necessary components and libraries
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Text, View } from "../components/Themed";
import { FadeInView } from "../components/animations";
// import { useLocalSearchParams } from "expo-router";
// import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the EditPlan component
export default function EditPlan(props: any) {
  // Get the color scheme of the device (light or dark)
  const colorScheme = useColorScheme();

  // Extract the title, amount, and category from local search parameters
  const { title, amount, category } = props.route.params;

  return (
    // Wrap the content in a SafeAreaView to avoid overlapping with the device's safe area
    <SafeAreaView>
      {/* Use the custom FadeInView component to apply fade-in animation */}
      <FadeInView _duration={150}>
        {/* Main content container */}
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
                value={+title !== 0 ? title.toString() : ""}
                placeholderTextColor="grey"
                keyboardType="default"
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
                value={amount.toString()}
                placeholderTextColor="grey"
                keyboardType="default"
              />
            </View>

            {/* Category selection input section */}
            <View className="space-y-1 pb-3 pt-5">
              <Text className="dark:text-white text-lg font-semibold">
                Choose Category
              </Text>
              {/* TextInput for choosing the category */}
              <TextInput
                className="py-2 px-3 dark:text-white rounded-lg"
                style={{ borderColor: "grey", borderWidth: 2 }}
                placeholder="Choose..."
                placeholderTextColor="grey"
                keyboardType="default"
                value={category.toString()}
              />
            </View>

            {/* Button to submit the form (Add or Edit) */}
            <TouchableOpacity
              className="flex justify-center items-center rounded-lg"
              style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            >
              <Text className="text-white py-3">
                {+title !== 0 ? "Edit" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInView>
    </SafeAreaView>
  );
}