import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { FadeInView } from "../animations";
import { Text, View } from "../Themed";
import { Ionicons, Octicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function AddEdit({
  setToggle,
  category,
  setCategory,
}: {
  category?: string;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const colorScheme = useColorScheme();
  return (
    <FadeInView _duration={150}>
      <View
        style={{
          backgroundColor:
            colorScheme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
        }}
        className="w-full flex justify-center items-center h-screen py-4 px-2"
      >
        <View className="rounded-xl w-full pb-10 px-4 pt-8">
          <View
            style={{ backgroundColor: "transparent" }}
            className="flex flex-row justify-between items-center"
          >
            <Text className="dark:text-white text-lg font-semibold">
              {category ? (
                <Octicons
                  name="pencil"
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              ) : (
                "New Category"
              )}
            </Text>
            <TouchableOpacity
              onPress={() => setToggle(false)}
              className="px-1 py-1"
            >
              <Ionicons
                name="close-sharp"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          </View>
          <View className="space-y-1 pb-3 pt-5">
            <Text className="dark:text-white text-lg font-semibold">
              Description
            </Text>
            <TextInput
              className="py-2 px-3 dark:text-white rounded-lg"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholder="e.g shopping"
              placeholderTextColor="grey"
              value={category}
              keyboardType="default"
            />
          </View>
          <TouchableOpacity
            className="flex justify-center items-center rounded-lg"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          >
            <Text className="text-white py-3">
              {category ? "Edit" : "Add Category"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeInView>
  );
}
