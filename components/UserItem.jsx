import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { supabase } from "@/lib/supabase";
export default function UserItem({id}) {
  const [username, setUsername] = useState("");
  const getUsername = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_name")
        .eq("uuid", id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setUsername(data.user_name);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <View className="items-center">
      <Image
        style={{
          height: hp(8),
          width: hp(8),
          borderRadius: 100,
        }}
        source={
          "https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/" +
          id +
          "/" +
          id +
          ".jpeg"
        }
        contentFit="contain"
        placeholder={require("@/assets/images/default_avatar.png")}
        transition={100}
        allowDownscaling={true}
        cachePolicy={"memory"}
      />
      <Text className="font-inter text-white font-bold max-w-20 truncate line-clamp-1">
        {username}
      </Text>
    </View>
  );
}
