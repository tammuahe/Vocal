import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import InboxHeader from "../../components/InboxHeader";
import MessageList from "../../components/MessageList";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import SendIcon from '@/assets/icons/send-svgrepo-com.svg'

export default function Inbox() {
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const userId = user.id;
  const [conversationId, setConversationId] = useState(item["conversation_id"]);
  const [participantId, setParticipantId] = useState(
    item["participants_id"].split(",")
  );
  const [message, setMessage] = useState("");
  // console.log('conversationId: ', conversationId)
  // console.log('participantUsernames: ',participantUsernames)
  // console.log('participantId: ', participantId)

  //console.log('item data: ', item['conversation_id'])

  const handleSendMessage = async () => {
    const messageText = message.trim();
    console.log("messageText: ", messageText);
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

      if (error) {
        console.error("Supabase error:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <View className="flex-1 bg-lightblue">
      <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
        <StatusBar style="dark" />
        <InboxHeader
          conversationId={conversationId}
          participantId={participantId}
        />
        <View className="flex-1 justify-between overflow-visible">
          <View className="flex-1 ml-3 mr-4 ">
            <MessageList conversationId={item["conversation_id"]} />
          </View>
          <View className="pt-2">
            <View
              className="flex-row justify-between p-3 items-center bg-lightgrey"
              style={{ height: hp(10) }}
            >
              <View className="flex-1 m-2 pl-4 rounded-2xl items-start bg-white">
                <TextInput

                  value={message}
                  onChangeText={(value) => setMessage(value)}
                  placeholder="Nhập tin nhắn..."
                  style={{ fontSize: hp(2), width:'100%' }}
                  className="flex-1 mr-2"
                />
              </View>
              <TouchableOpacity
                onPress={handleSendMessage}
                className="rounded-full items-center m-2"
              >
                <SendIcon height='36' width='36' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
