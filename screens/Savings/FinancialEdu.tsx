import React, { useCallback, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from "react-native"; // Importing TouchableOpacity and ScrollView
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer, { getYoutubeMeta } from "react-native-youtube-iframe";
import { Text, View } from "../../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Data } from "../../utils/FinancialEdu";

export default function FinancialEdu(props: any) {
  const colorScheme = useColorScheme();
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
    }
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
        <View style={{ paddingHorizontal: 4 }}>
          {Data?.map((e, i) => {
            return (
              <View key={i}>
                <YoutubePlayer
                  height={250}
                  webViewStyle={{opacity: 0.99}}
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
