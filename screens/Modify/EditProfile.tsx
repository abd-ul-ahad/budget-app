import {
  Image,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Payload, initialPayload } from "../../components/SignUp";
import { ConPassword, ValName, ValPassword } from "../../constants/Validations";
import { triggerNotifications } from "../../utils/Notifications";
import { Snackbar } from "react-native-paper";
import { Auth } from "../../firebase/init";
import { login as LoginState } from "../../store/slices/userSlice";
import { firebase } from "@react-native-firebase/auth";

export default function EditProfile(props: any) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);

  const [payload, setPayload] = useState<Payload>({
    ...initialPayload,
    name: user.name,
  });
  const [toggleSnackbar, setToggleSnackbar] = useState<{
    open: boolean;
    msg: string;
  }>({ open: false, msg: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const { isName, isPass, isPassMatched } = payload;

    if (isName && ((isPass && isPassMatched) || payload.password === "")) {
      try {
        const update = {
          displayName: payload.name,
        };

        payload.name === user.name &&
          setToggleSnackbar({ open: true, msg: "Can't set the value" });

        payload.name !== user.name &&
          (await Auth.currentUser?.updateProfile(update));

        // TODO
        // payload.password !== "" &&
        //   (await firebase.auth.EmailAuthProvider.credential(
        //     Auth.currentUser!,
        //     "df"
        //   ));
        dispatch(
          LoginState({
            name: Auth.currentUser?.displayName!,
            email: Auth.currentUser?.email!,
            uid: Auth.currentUser?.uid!,
          })
        );
        triggerNotifications("Profile updated.", null);
      } catch (error: any) {
        console.log({ error });

        setToggleSnackbar({
          open: true,
          msg:
            error.code === "auth/email-already-in-use"
              ? "Email already in use"
              : "Invalid Credentials",
        });
        setIsLoading(false);
        return;
      }

      setPayload(initialPayload);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex flex-row justify-start items-center pt-4">
          <TouchableOpacity
            className="py-4 px-3"
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={26}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
            Profile
          </Text>
        </View>
        <View className="flex justify-center items-center space-y-3 pt-3 pb-5">
          <Image
            className="rounded-full"
            style={{
              width: 100,
              height: 100,
              resizeMode: "stretch",
            }}
            source={require("../../assets/images/fff.webp")}
          />
          <View className="px-3">
            <Text
              className="text-xl text-center font-semibold"
              style={{ color: Colors[colorScheme ?? "light"].text }}
            >
              {user.name}
            </Text>
            <Text
              className="tracking-wider text-base text-center font-semibold"
              style={{ color: "#767676" }}
            >
              {user.email}
            </Text>
          </View>
        </View>
        <View className="px-3">
          <View className="space-y-1">
            <Text className="dark:text-white text-base font-semibold">
              Username
            </Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g john"
              keyboardType="default"
              value={payload.name}
              onChangeText={(text) =>
                setPayload({ ...payload, name: text, isName: ValName(text) })
              }
            />
            <Text
              className="text-right text-red-700 opacity-1 mr-2"
              style={{ opacity: payload.isName === false ? 1 : 0 }}
            >
              Invalid Name
            </Text>
          </View>

          <Text className="dark:text-white text-lg font-semibold mb-1">
            New password
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
                  isPassMatched: ConPassword(text, payload.cPassword!),
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
          <View className="space-y-1">
            <Text className="dark:text-white text-base foInvalid credentialsnt-semibold">
              Confirm Password
            </Text>
            <TextInput
              className="py-2 px-3 dark:text-white rounded-full"
              style={{
                borderColor: "grey",
                borderWidth: 2,
              }}
              placeholder="*****"
              secureTextEntry={!showPassword}
              placeholderTextColor="grey"
              keyboardType="default"
              value={payload.cPassword}
              onChangeText={(text) =>
                setPayload({
                  ...payload,
                  cPassword: text,
                  isPassMatched: ConPassword(payload.password!, text),
                })
              }
            />
            <Text
              className="text-right text-red-700 mt-1 mr-2"
              style={{ opacity: payload.isPassMatched === false ? 1 : 0 }}
            >
              Password does not matched
            </Text>
          </View>
        </View>
        <View className="px-3 pb-10">
          <TouchableOpacity
            className="flex justify-center items-center flex-row py-4 rounded-full"
            style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
            onPress={() => handleSubmit()}
          >
            <Text style={{ color: "white" }} className="text-sm tracking-wide ">
              {isLoading ? "Loading..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        style={{ marginBottom: "1%" }}
        visible={toggleSnackbar?.open}
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
