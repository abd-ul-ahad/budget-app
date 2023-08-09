import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { useLogout } from "../../firebase/useLogout";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar } from "react-native-paper";
import { useState } from "react";

export default function Profile() {
  const { logout } = useLogout();
  const [toggleSnackbar, setToggleSnackbar] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 justify-center items-center h-screen">
          <TouchableOpacity
            className="px-3 py-2 bg-slate-500"
            onPress={() => setToggleSnackbar(true)}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
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
