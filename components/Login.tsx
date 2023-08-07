import {
  Image,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";

import { ValEmail, ValPassword } from "../constants/Validations";
// import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLogin } from "../firebase/useLogin";
import { Snackbar } from "react-native-paper";
import { set } from "../store/slices/snackSlice";
import { useDispatch } from "react-redux";

interface Payload {
  email?: string;
  password?: string;
  isEmail?: boolean | null;
  isPass?: boolean | null;
}

const initialPayload: Payload = {
  email: "",
  password: "",
  isEmail: null,
  isPass: null,
};

export default function Login({ flatListRef }: { flatListRef: any }) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [toggleSnackbar, setToggleSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "Invalid credentials" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // logging in
  const { login } = useLogin();

  const handleSubmit = async () => {
    setIsLoading(true);
    if (payload.isEmail && payload.isPass) {
      try {
        await login(payload.email!, payload.password!);
        dispatch(set({ toggle: true, msg: "Login Successful" }));
        123456;
      } catch (error: any) {
        setToggleSnackbar({
          open: true,
          msg:
            error.code === "auth/wrong-password"
              ? "Wrong Password"
              : error.code === "auth/user-not-found"
              ? "Email not registered"
              : "Invalid credentials",
        });
        setIsLoading(false);
        return;
      }

      setPayload(initialPayload);
      setIsLoading(false);
      return;
    }

    setPayload({ isEmail: false, isPass: false });
    setIsLoading(false);
  };

  return (
    <SafeAreaView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      <View className="space-y-4 mb-9">
        <View className="flex justify-center items-center">
          {colorScheme === "light" ? (
            <Image
              style={{ resizeMode: "contain", width: 200, height: 200 }}
              source={require("../assets/images/logo.png")}
            />
          ) : (
            <Image
              style={{ resizeMode: "contain", width: 200, height: 200 }}
              source={require("../assets/images/logo-dark.png")}
            />
          )}
        </View>
        <View>
          <View className="space-y-1">
            <Text className="dark:text-white text-lg font-semibold">Email</Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g username@domain.com"
              keyboardType="email-address"
              value={payload.email}
              onChangeText={(text) =>
                setPayload({ ...payload, email: text, isEmail: ValEmail(text) })
              }
            />
            <Text
              className="text-right text-red-700 mr-2"
              style={{
                opacity: payload.isEmail === false ? 1 : 0,
              }}
            >
              Invalid Email
            </Text>
          </View>
          <Text className="dark:text-white text-lg font-semibold">
            Password
          </Text>
          <View className="flex flex-row">
            <TextInput
              className="py-2 px-3 dark:text-white rounded-l-full w-11/12"
              style={{
                borderColor: "grey",
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                borderTopWidth: 2,
              }}
              placeholder="*****"
              secureTextEntry={!showPassword}
              placeholderTextColor="grey"
              keyboardType="default"
              value={payload.password}
              onChangeText={(text) =>
                setPayload({
                  ...payload,
                  password: text,
                  isPass: ValPassword(text),
                })
              }
            />
            <Pressable
              className="rounded-r-full h-full flex justify-between items-center py-3 pr-2"
              onPress={() => setShowPassword(!showPassword)}
              style={{
                borderColor: "grey",
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderTopWidth: 2,
              }}
            >
              {showPassword ? (
                <FontAwesome5
                  name="eye"
                  size={18}
                  color={Colors[colorScheme ?? "light"].text}
                />
              ) : (
                <FontAwesome5
                  name="eye-slash"
                  size={16}
                  color={Colors[colorScheme ?? "light"].text}
                />
              )}
            </Pressable>
          </View>
          <Text
            className="text-right text-red-700 mt-1 mr-2"
            style={{ opacity: payload.isPass === false ? 1 : 0 }}
          >
            Minimum 6 characters
          </Text>
        </View>

        <TouchableOpacity
          className="flex justify-between items-center flex-row py-4 rounded-full mt-3"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          onPress={() => handleSubmit()}
        >
          <Entypo
            name="chevron-right"
            size={1}
            className="opacity-0"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <Text style={{ color: "white" }} className="text-sm tracking-wide ">
            {isLoading ? "Loading..." : "Login"}
          </Text>
          <Entypo name="chevron-right" size={20} color={"white"} />
        </TouchableOpacity>

        <View className="flex flex-row justify-center items-center">
          <Text>New here?</Text>
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() =>
              flatListRef.current?.scrollToIndex({ animated: true, index: 1 })
            }
          >
            <Text
              style={{ color: Colors[colorScheme ?? "light"].tint }}
              className="font-bold tracking-wider"
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnackbar.open}
        onDismiss={() => setToggleSnackbar({ ...toggleSnackbar!, open: false })}
        action={{
          label: "Close",
          onPress: () => setToggleSnackbar({ ...toggleSnackbar!, open: false }),
        }}
      >
        {toggleSnackbar?.msg}
      </Snackbar>
    </SafeAreaView>
  );
}
