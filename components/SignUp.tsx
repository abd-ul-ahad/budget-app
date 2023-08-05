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
import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
import {
  ValEmail,
  ValName,
  ValPassword,
  ConPassword,
} from "../constants/Validations";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Firebase
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

interface Payload {
  name?: string;
  email?: string;
  password?: string;
  cPassword?: string;
  isName?: boolean | null;
  isEmail?: boolean | null;
  isPass?: boolean | null;
  isPassMatched?: boolean | null;
  error?: boolean;
}

const initialPayload: Payload = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  isName: null,
  isEmail: null,
  isPass: null,
  isPassMatched: null,
  error: false,
};

export default function SignUp({
  flatListRef,
  navigation,
}: {
  navigation: any;
  flatListRef: any;
}) {
  const colorScheme = useColorScheme();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [errorMessage, setErrorMessage] = useState<string>("Invalid email");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const { isName, isEmail, isPass, isPassMatched, email, password } = payload;

    if (isName && isEmail && isPass && isPassMatched) {
      try {
        const resp = await auth().createUserWithEmailAndPassword(
          email!,
          password!
        );
        console.log(resp);

        setPayload(initialPayload);
        setIsLoading(false);
        
      } catch (error) {
        console.log(error);
        if (error === "auth/email-already-in-use") {
          setErrorMessage("Email already in use.");
        }
        setPayload({ ...payload, error: true });
        setIsLoading(false);
        return;
      }

      setPayload(initialPayload);
      setIsLoading(false);
      return;
    }

    setPayload(initialPayload);
    setIsLoading(false);
  };

  return (
    <SafeAreaView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View className="space-y-4">
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
          <View className="space-y-1">
            <Text className="dark:text-white text-base font-semibold">
              Email
            </Text>
            <TextInput
              className="border-2 py-2 px-3 dark:text-white rounded-full"
              style={{ borderColor: "grey", borderWidth: 2 }}
              placeholderTextColor="grey"
              placeholder="e.g username@domain.com"
              keyboardType="default"
              value={payload.email}
              onChangeText={(text) =>
                setPayload({ ...payload, email: text, isEmail: ValEmail(text) })
              }
            />
            <Text
              className="text-right text-red-700 mr-2"
              style={{
                opacity:
                  payload.isEmail === false || payload.error === true ? 1 : 0,
              }}
            >
              {errorMessage}
            </Text>
          </View>
          <Text className="dark:text-white text-lg font-semibold mb-1">
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
            <Text className="dark:text-white text-base font-semibold">
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
        <TouchableOpacity
          className="flex justify-between items-center flex-row py-4 rounded-full"
          style={{ backgroundColor: Colors[colorScheme ?? "light"].tint }}
          onPress={() => handleSubmit()}
        >
          <Entypo
            name="chevron-right"
            size={1}
            className="opacity-1"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <Text style={{ color: "white" }} className="text-sm tracking-wide ">
            {isLoading ? "Loading..." : "Register"}
          </Text>
          <Entypo name="chevron-right" size={20} color={"white"} />
        </TouchableOpacity>
        <View className="flex flex-row justify-center items-center">
          <Text>Already registered?</Text>
          <TouchableOpacity
            className="py-2 px-3"
            onPress={() =>
              flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
            }
          >
            <Text
              style={{ color: Colors[colorScheme ?? "light"].tint }}
              className="font-bold tracking-wider"
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
