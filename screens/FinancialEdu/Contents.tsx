import React, { useCallback, useState } from "react";
import { TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import SelectCategory from "../../utils/FinancialEdu";

export default function FinancialContent(props: any) {
  const colorScheme = useColorScheme();
  const { title } = props.route.params;
  const [playing, setPlaying] = useState(false);

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
            className="text-xl"
            style={{
              fontWeight: "bold",
              paddingLeft: 3,
              textAlign: "left",
              paddingVertical: 4,
            }}
          >
            {title != undefined ? title : `Financial Education`}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 4 }}>
          {SelectCategory(title)?.map((e, i) => {
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
