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
        <View className="flex justify-center items-center pt-6">
          <View className="flex mb-3 justify-between flex-row items-start w-full">
            <Text className="text-2xl font-semibold py-4 tracking-wider pl-6">
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
            <View className="flex pl-3 space-x-6 mb-5 flex-row justify-start items-center">
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
            </View>
            <View className="w-full">
              <TouchableOpacity className="px-5 py-3 flex w-full justify-start items-start">
                <Text className="font-semibold tracking-wider text-base">
                  Account
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity
                className="px-5 py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("GoalBasedSavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Goal based saving
                </Text>
              </TouchableOpacity>
            </View>
            <View
              className="w-full"
              style={{ borderTopWidth: 15, borderTopColor: "#f5f5f5" }}
            >
              <TouchableOpacity
                className="px-5 py-3 flex w-full justify-start items-start"
                onPress={() => setToggleSnackbar(true)}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Logout
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
