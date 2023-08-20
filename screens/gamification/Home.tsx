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
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ConPassword, ValName, ValPassword } from "../../constants/Validations";
import { triggerNotifications } from "../../utils/Notifications";
import { Snackbar } from "react-native-paper";
import { Auth } from "../../firebase/init";
import { login as LoginState } from "../../store/slices/userSlice";
import { firebase } from "@react-native-firebase/auth";

export interface Payload {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  cPassword?: string;
  isName?: boolean | null;
  isEmail?: boolean | null;
  isNewPass?: boolean | null;
  isPassMatched?: boolean | null;
  isOldPass?: boolean | null;
}

export const initialPayload: Payload = {
  newPassword: "",
  cPassword: "",
  oldPassword: "",
  isName: null,
  isEmail: null,
  isNewPass: null,
  isPassMatched: null,
  isOldPass: null,
};

export default function Gamification(props: any) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const user = useSelector((state: RootState) => state.user);
  const levelInfo = useSelector((state: RootState) => state.levels);

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
  const [showEmail, setShowEmail] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const { isName, isNewPass, isPassMatched, isOldPass } = payload;

    if (
      isName !== false &&
      ((isNewPass && isPassMatched && isOldPass) || payload.newPassword === "")
    ) {
      try {
        const update = {
          displayName: payload.name,
        };

        payload.name !== user.name &&
          (async function () {
            await Auth.currentUser?.updateProfile(update);
            setToggleSnackbar({
              open: true,
              msg: "Name updated.",
            });

            // updating state variables
            dispatch(
              LoginState({
                name: Auth.currentUser?.displayName!,
                email: Auth.currentUser?.email!,
                uid: Auth.currentUser?.uid!,
              })
            );
          })();

        // changing password
        const provider = firebase.auth.EmailAuthProvider;
        const authCredential = provider.credential(
          user.email,
          payload.oldPassword!
        );

        payload.isOldPass === true &&
          Auth.currentUser
            ?.reauthenticateWithCredential(authCredential)
            .then(() => {
              var user = firebase.auth().currentUser;
              user!
                .updatePassword(payload.newPassword!)
                .then(() => {
                  triggerNotifications("Profile updated.", null);
                  return;
                })
                .catch(() => {
                  setToggleSnackbar({
                    open: true,
                    msg: "Please try again later",
                  });
                  return;
                });
            })
            .catch(() => {
              setToggleSnackbar({
                open: true,
                msg: "Please try again later",
              });
              return;
            });

        payload.name !== user.name &&
          triggerNotifications("Profile updated.", null);
      } catch (error: any) {
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
          <View className="relative">
            <Image
              className="rounded-full"
              style={{
                width: 120,
                height: 120,
                resizeMode: "stretch",
              }}
              source={require("../../assets/images/fff.webp")}
            />
            <TouchableOpacity
              className="absolute rounded-full py-2 px-2"
              style={{
                top: -12,
                right: -12,
                zIndex: 10000,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <FontAwesome name="pencil" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="px-3">
            <Text
              className="text-xl text-center font-semibold"
              style={{ color: Colors[colorScheme ?? "light"].text }}
            >
              {user.name}
            </Text>
            <View className="flex flex-row justify-center items-center space-x-3">
              <Text
                className="tracking-wider text-base text-center font-semibold"
                style={{ color: "#767676" }}
              >
                {showEmail ? user.email : hideUsername(user.email)}
              </Text>
              <Pressable
                onPress={() => setShowEmail(!showEmail)}
                className="py-2 px-2"
              >
                {showEmail ? (
                  <FontAwesome5
                    name="eye"
                    size={18}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                ) : (
                  <FontAwesome5
                    name="eye-slash"
                    size={18}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <View className="flex flex-row justify-start items-center w-full pl-3">
            <View className="flex-1 relative">
              <View
                style={{
                  height: 25,
                  width: "100%",
                  backgroundColor: "rgba(59, 114, 80, 0.2)",
                }}
                className="rounded-full"
              >
                <View
                  style={{
                    width: `${(levelInfo.current / levelInfo.target) * 100}%`,
                    height: "100%",
                    backgroundColor: "#fdd300",
                  }}
                  className="rounded-full"
                />
                <Text className="absolute text-sm w-full text-center pt-1 font-semibold tracking-wider">
                  {`${levelInfo.current} / ${levelInfo.target}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                zIndex: 100,
                left: -30,
              }}
            >
              <Image
                className="rounded-full"
                style={{ width: 60, height: 60, resizeMode: "stretch" }}
                source={require("../../assets/images/star.png")}
              />
              <Text
                className="absolute tracking-widest w-5 text-center"
                style={{ top: 24, right: 20, fontWeight: "900" }}
              >
                {levelInfo.level}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="pl-4 py-4 flex w-full justify-start items-start"
            onPress={() => props.navigation.navigate("EditProfile")}
          >
            <Text className="font-semibold tracking-wider text-base">
              Name / Password
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

export function hideUsername(email: string): string {
  const atIndex = email.indexOf("@");

  if (atIndex !== -1) {
    const hiddenUsername = "*".repeat(atIndex) + email.substring(atIndex);
    return hiddenUsername;
  }

  return email;
}
