import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { Avatars } from "../../gamification/Avatars/_Paths";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import { setAvatar } from "../../store/slices/avatarSlice";
import { FadeInView } from "../../components/animations";

export default function SelectAvatar(props: any) {
  const colorScheme = useColorScheme();
  const avatar = useSelector((state: RootState) => state.avatar.path);
  const dispatch = useDispatch();

  //
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    setLoading(true);
    dispatch(setAvatar({ path: e }));
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <FadeInView _duration={500}>
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
              Avatar
            </Text>
          </View>
          {
            <>
              <View className="w-full justify-center items-center flex pt-5">
                {loading ? (
                  <Image
                    className="rounded-full"
                    style={{
                      width: 120,
                      height: 120,
                      resizeMode: "stretch",
                    }}
                    source={require("../../assets/loading.gif")}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("FullScreenAvatar")
                    }
                  >
                    <Image
                      className="rounded-full"
                      style={{
                        width: 120,
                        height: 120,
                        resizeMode: "stretch",
                      }}
                      source={avatar}
                    />
                  </TouchableOpacity>
                )}
                {/*  */}
              </View>
              <View
                className="justify-between pt-7"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {Avatars.map((e, i) => {
                  return (
                    <TouchableOpacity
                      disabled={loading}
                      key={i}
                      onLongPress={() =>
                        props.navigation.navigate("FullScreenAvatar", {
                          avatar: e,
                        })
                      }
                      onPress={() => handleSubmit(e)}
                      className="mx-4 my-5"
                    >
                      <Image
                        className="rounded-full"
                        style={{
                          width: 70,
                          height: 70,
                          resizeMode: "stretch",
                        }}
                        source={e}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          }
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}
