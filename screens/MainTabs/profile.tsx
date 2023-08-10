import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLogout } from "../../firebase/useLogout";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar } from "react-native-paper";
import { useState } from "react";
import Colors from "../../constants/Colors";
import { Feather } from "@expo/vector-icons";

export default function Profile(props: any) {
  const { logout } = useLogout();
  const colorScheme = useColorScheme();
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
      >
        <View className="flex justify-center items-center pt-6">
          <View className="flex justify-between flex-row items-start w-full pb-3">
            <Text className="text-xl font-semibold py-4 tracking-wider pl-6">
              Settings
            </Text>
            <TouchableOpacity
              className="py-4 px-4"
              onPress={() => props.navigation.navigate("Notifications")}
            >
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="w-full px-5 pt-3">
            <View className="w-full">
              <TouchableOpacity className="py-3 flex w-full justify-start items-start">
                <Text className="font-semibold tracking-wider text-base">
                  Account
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity
                className="py-3 flex w-full justify-start items-start"
                onPress={() => props.navigation.navigate("GoalBasedSavings")}
              >
                <Text className="font-semibold tracking-wider text-base">
                  Goal based saving
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity
                className="py-3 flex w-full justify-start items-start"
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
    </>
  );
}
