import React, { useCallback, useState } from "react";
import { TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Text, View } from "../../components/Themed";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Data } from "../../utils/FinancialEdu";

export default function FinancialEdu(props: any) {
  const colorScheme = useColorScheme();
  const [playing, setPlaying] = useState(false);
  const [filter, setFilter] = useState<{ open: boolean; payload: string }>({
    open: false,
    payload: "All",
  });

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") setPlaying(false);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 2,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ paddingVertical: 15, paddingHorizontal: 16 }}
            onPress={() => props.navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={22}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingLeft: 3,
              textAlign: "left",
              paddingVertical: 4,
            }}
          >
            Financial Education
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 2,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ paddingVertical: 15, paddingHorizontal: 16 }}
            onPress={() => setFilter({ ...filter, open: !filter.open })}
          >
            <Feather
              name="filter"
              size={22}
              color={Colors[colorScheme ?? "light"].text}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ display: filter.open ? "flex" : "none" }}
          className="flex justify-center items-center flex-row space-x-2 py-5"
        >
          {["All", "Management", "Savings", "Mental health"].map((e, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setFilter({ ...filter, payload: e })}
              style={{
                borderWidth: 2,
                backgroundColor:
                  e === filter.payload
                    ? Colors[colorScheme ?? "light"].tint
                    : "transparent",
                borderColor: Colors[colorScheme ?? "light"].tint,
              }}
              className="py-1 px-3 text-sm rounded-full"
            >
              <Text
                style={{
                  color:
                    e === filter.payload
                      ? "white"
                      : Colors[colorScheme ?? "light"].text,
                }}
              >
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ paddingHorizontal: 4 }}>
          {Data?.map((e, i) => {
            return (
              <View key={i}>
                <YoutubePlayer
                  height={250}
                  webViewStyle={{ opacity: 0.99 }}
                  play={playing}
                  videoId={e}
                  onChangeState={onStateChange}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
