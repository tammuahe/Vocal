import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import InboxHeader from "../../components/InboxHeader";
import MessageList from "../../components/MessageList";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import SendIcon from "@/assets/icons/send-svgrepo-com.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

const ios = Platform.OS === "ios";

export default function Inbox() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const userId = user.id;
  const [conversationId, setConversationId] = useState(item["conversation_id"]);
  const [participantId, setParticipantId] = useState(
    item["participants_id"].split(",")
  );
  const [message, setMessage] = useState("");
  const [hasAnyMessage, setHasAnyMessage] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const { height: screenHeight } = Dimensions.get("window");

  useEffect(() => {
    const onKeyboardShow = (event) => {
      setKeyboardOffset(91);
    };

    const onKeyboardHide = () => {
      setKeyboardOffset(0);
    };

    const showListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardShow
    );
    const hideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    const messageText = message.trim();
    setMessage("");
    if (!messageText) {
      return;
    }
    try {
      console.log("handleSendMessage called");
      const { error } = await supabase.from("conversation_messages").insert({
        message_text: messageText,
        conversation_id: conversationId,
        sender_id: userId,
      });
      console.log("tried to send message");
      setHasAnyMessage(true);

      if (error) {
        console.error("Supabase error:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <SafeAreaView
      style={{ height: screenHeight - hp(6) }}
    >
      <LinearGradient
        className="absolute bottom-0 top-0 left-0 right-0"
        colors={["#FFB9B9", "#A0C8FC"]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardOffset}
          behavior={ios ? "padding" : "height"}
        >
          <StatusBar style="dark" />
          <InboxHeader
            conversationId={conversationId}
            participantId={participantId}
            checkMessage={hasAnyMessage}
          />
          <View className="flex-1 pl-3 my-4 pb-3">
            <MessageList
              conversationId={item["conversation_id"]}
              anyMessage={(data) => setHasAnyMessage(data)}
            />
          </View>
          <View
            className="flex-row m-0 justify-between p-3 items-center bg-lightgrey"
            style={{ height: hp(10) }}
          >
            <View className="flex-1 m-2 pl-4 rounded-2xl items-start bg-white">
              <TextInput
                value={message}
                onChangeText={(value) => setMessage(value)}
                placeholder="Nhập tin nhắn..."
                style={{ fontSize: hp(2), width: "100%" }}
                className="flex-1 mr-2"
              />
            </View>
            <TouchableOpacity
              onPress={handleSendMessage}
              className="rounded-full items-center m-2"
            >
              <SendIcon height="36" width="36" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
