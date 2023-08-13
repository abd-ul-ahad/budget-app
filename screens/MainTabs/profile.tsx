import {
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLogout } from "../../firebase/useLogout";
import { Snackbar } from "react-native-paper";
import { useState } from "react";
import Colors from "../../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile(props: any) {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useLogout();
  const colorScheme = useColorScheme();
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View className="flex justify-center items-center pt-2">
          <View className="flex mb-3 justify-between flex-row items-center w-full">
            <Text className="text-2xl font-semibold py-4 tracking-wider pl-4">
              Profile
            </Text>
            <TouchableOpacity
              className="py-4 px-4"
              onPress={() => props.navigation.navigate("Notifications")}
            >
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="w-full pt-1">
            <View className="pl-6 py-3 flex w-full justify-start items-start">
              <Text
                className="font-semibold tracking-wider"
                style={{ color: "#767676" }}
              >
                Account
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("EditProfile")}
              className="flex pl-6 space-x-6 mb-5 flex-row justify-start items-center"
            >
              <Image
                className="rounded-full"
                style={{ width: 50, height: 50, resizeMode: "stretch" }}
                source={require("../../assets/images/fff.webp")}
              />
              <View>
                <Text className="font-semibold tracking-wider text-xl">
                  {user?.name || "New user"}
                </Text>
                <Text
                  className="tracking-wider text-base text-center font-semibold"
                  style={{ color: "#767676" }}
                >
                  {user?.email}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="w-full">
              <TouchableOpacity
                className="pl-6 py-3 flex w-full justify-start items-start"
                onPress={() => setToggleSnackbar(true)}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              style={{
                borderTopWidth: 6,
                borderTopColor: colorScheme === "light" ? "#f5f5f5" : "#767676",
              }}
            />
            <View className="w-full">
              <View className="pl-6 py-3 flex w-full justify-start items-start">
                <Text
                  className="font-semibold tracking-wider"
                  style={{ color: "#767676" }}
                >
                  Savings
                </Text>
              </View>
              <TouchableOpacity
                className="pl-6 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("Savings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Saving Goals
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-6 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("GoalBasedSavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Goal based saving strategies
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pl-6 py-3 flex w-full justify-start items-start"
                // onPress={() => props.navigation.navigate("GoalBasedSavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Financial education
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "5%" }}
        visible={toggleSnackbar}
        onDismiss={() => setToggleSnackbar(false)}
        action={{
          label: "Yes",
          onPress: async () => {
            await logout();
          },
        }}
      >
        Are you sure?
      </Snackbar>
    </SafeAreaView>
  );
}
