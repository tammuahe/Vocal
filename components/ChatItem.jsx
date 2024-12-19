import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { blurhash } from "@/utils/common";
export default function ChatItem(item) {
  const [conversationImage, setConversationImage] = useState();
  const [participants, setParticipants] = useState([]);
  const [participantsUsernames, setParticipantsUsernames] = useState([]);
  const [conversationTitle, setConversationTitle] = useState("");
  const [lastTime, setLastTime] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const router = useRouter();
  const fetchLastMessageAndTime = async () => {
    try {
      const { data, error } = await supabase
        .from("conversation_messages")
        .select("message_text, created_at")
        .eq("conversation_id", item.item.conversation_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastMessage(data.message_text);
        setLastTime(formatDate(data.created_at));
      }
    } catch (err) {
      console.error("Error fetching last message and time:", err);
    }
  };
  const fetchConversationName = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("conversation_name")
        .eq("id", item.item.conversation_id)
        .single();

      if (!error && data) {
        setConversationTitle(data.conversation_name);
      }
    } catch (err) {
      console.error("Error fetching conversation name:", err);
    }
  };

  useEffect(() => {
    getParticipants();
    fetchConversationName();
    getConversationsPicture();

    // Fetch initial last message and time
    fetchLastMessageAndTime();

    // Subscribe to real-time updates for new messages
    const channel = supabase
      .channel("messageUpdates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${item.item.conversation_id}`,
        },
        (payload) => {
          const { message_text, created_at } = payload.new;
          setLastMessage(message_text);
          setLastTime(formatDate(created_at));
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.item.conversation_id]);

  const getConversationsPicture = async () => {
    try {
      //console.log('getConverpic called');
      const { data, error } = await supabase
        .from("conversations")
        .select("conversation_picture")
        .eq("id", item.item.conversation_id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
      } else {
        //console.log('convopic fetched:',data['conversation-picture']);
        setConversationImage(data["conversation_picture"]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getParticipants = async () => {
    try {
      //console.log('getParticipants called');
      const { data, error } = await supabase
        .from("conversation_participants")
        .select("participant_id")
        .eq("conversation_id", item.item.conversation_id);
      //console.log('participants fetched:',data);

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setParticipants(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    getParticipantsUsernames(participants);
  }, [participants]);
  const getParticipantsUsernames = async (userIds) => {
    try {
      // Use Promise.all to fetch all usernames concurrently
      const usernames = await Promise.all(
        userIds.map(async (userId) => {
          const { data, error } = await supabase
            .from("profiles")
            .select("user_name")
            .eq("uuid", userId.participant_id)
            .single();

          if (error) {
            console.error("Supabase error:", error);
            return null;
          }

          return data?.user_name;
        })
      );
      const uniqueUsernames = [...new Set(usernames.filter(Boolean))];

      setParticipantsUsernames((prev) => {
        return [...new Set([...prev, ...uniqueUsernames])];
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const formatDate = (timestamp) => {
    const inputDate = new Date(timestamp);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000); // Hôm qua
    const startOfLastWeek = new Date(startOfToday.getTime() - 7 * 86400000); // Tuần trước

    if (inputDate >= startOfToday) {
      return inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (inputDate >= startOfYesterday) {
      return inputDate.toLocaleDateString("vi-VN", { weekday: "long" });
    }

    if (inputDate >= startOfLastWeek) {
      return inputDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    return inputDate.toLocaleDateString("vi-VN");
  };

  const openInbox = () => {
    router.push({
      pathname: "/inbox",
      params: {
        conversation_id: item.item.conversation_id,
        participantsUsernames,
        participants_id: participants.flatMap(Object.values),
      },
    });
  };

  return (
    <TouchableOpacity
      className="flex-row justify-between items-center h-[60px] gap-3 mb-2 p-4 border-neutral-950 overflow-hidden bg-white rounded-2xl"
      onPress={() => {
        openInbox();
      }}
    >
      <Image
        source={conversationImage}
        style={{ height: hp(5), width: hp(5), borderRadius: 100 }}
        contentFit="contain"
        placeholder={{blurhash}}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(2), maxWidth: wp(45) }}
            ellipsizeMode="tail"
            numberOfLines={1}
            className="font-semibold text-neutral-800"
          >
            {conversationTitle
              ? conversationTitle
              : participantsUsernames.join(", ")}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-skyblue"
          >
            {lastTime}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.8) }}
          className="font-medium text-neutral-500"
        >
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
