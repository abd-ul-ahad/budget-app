// Import required components and modules
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { FadeInView } from "../../components/animations";
import { useState } from "react";
import Single from "../../components/category/Single";
import AddEdit from "../../components/category/AddEdit";

// Define the Spending component
export default function Category() {
  // Get the current color scheme
  const colorScheme = useColorScheme();

  // State variables
  const [toggle, setToggle] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");

  // Render the component
  return (
    <>
      {/* Render AddEdit component if 'toggle' is true */}
      {toggle && (
        <AddEdit
          setToggle={setToggle}
          category={category}
          setCategory={setCategory}
        />
      )}

      {/* SafeAreaView to handle safe area for different devices */}
      <SafeAreaView>
        {/* Fade in the ScrollView */}
        <FadeInView _duration={300}>
          {/* ScrollView to provide scrollable content */}
          <ScrollView
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            {/* Categories header */}
            <View className="flex justify-center items-start pt-5 pb-3">
              <Text className="text-xl font-semibold tracking-wider pl-3">
                Categories
              </Text>
            </View>

            {/* Container for categories */}
            <View className="pt-3 mb-10 space-y-2 px-3">
              {/* Button to add a new category */}
              <TouchableOpacity
                onPress={() => {
                  setCategory("");
                  setToggle(true);
                }}
                className="flex justify-center items-center rounded-lg"
                style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
              >
                <Text className="text-white py-3">New Category</Text>
              </TouchableOpacity>

              {/* Container for existing categories */}
              <View className="py-3">
                {/* Render existing categories */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e, i, a) => (
                  <View key={i}>
                    {/* TouchableOpacity for each category */}
                    <TouchableOpacity
                      className="py-3"
                      onPress={() => {
                        setCategory("Shopping");
                        setToggle(true);
                      }}
                    >
                      {/* Render Single component */}
                      <Single />
                    </TouchableOpacity>

                    {/* Divider between categories */}
                    {a.length - 1 !== i && (
                      <View
                        style={{ height: 1, backgroundColor: "gray" }}
                        className="w-full"
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </FadeInView>
      </SafeAreaView>
    </>
  );
}
