import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  MessageContainer,
} from "react-native-gifted-chat";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const CHAT_GPT_API_KEY = "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";

export default function ChatHome(props: any) {
  const [messages, setMessages] = useState<any>([]);
  const avatar = useSelector((state: RootState) => state.avatar.path);
  const colorScheme = useColorScheme();

  const sendMessage = async (message: string) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          model: "gpt-3.5-turbo",
        },
        {
          headers: {
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(err, "api call error");
    }
  };

  const onSend = async (newMessages: any = []) => {
    setMessages((prev: any) => GiftedChat.append(prev, newMessages));

    const response = await sendMessage(newMessages[0].text);
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "GPT-3.5-turbo",
          avatar: require("../../assets/icons/bot.png"),
        },
      },
    ];

    setMessages((prev: any) => GiftedChat.append(prev, chatMessage));
  };

  const user = {
    _id: 1,
    name: "Developer",
    avatar,
  };

  const renderInputToolbar = (props: any) => {
    return <InputToolbar {...props} containerStyle={styles.input} />;
  };

  return (
    <>
      <View className="flex-row flex pt-7 justify-start items-center">
        <TouchableOpacity
          className="py-4 px-3"
          onPress={() => props.navigation.goBack()}
        >
          <Ionicons
            name="chevron-back-sharp"
            size={22}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <Text className="text-xl flex-1 pl-3 font-bold tracking-wider text-start py-4">
          Assistant
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          // listViewProps={{
          //   style: {
          //     backgroundColor: "purple",
          //   },
          // }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "white",
                  },
                  left: {
                    color: "black",
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                    marginVertical: 10,
                  },
                  left: { marginVertical: 10 },
                }}
              />
            );
          }}
          messages={messages}
          onSend={(message) => onSend(message)}
          user={user}
          placeholder={"Whats on your mind?"}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          renderInputToolbar={renderInputToolbar}
          renderSend={(prop) => {
            const { text, onSend } = prop;

            return (
              <TouchableOpacity
                onPress={() => {
                  if (text && onSend) {
                    onSend(
                      {
                        text: text.trim(),
                        user: user,
                      },
                      true
                    );
                  }
                }}
                className="px-3 py-2"
              >
                <FontAwesome
                  name="send"
                  size={24}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
