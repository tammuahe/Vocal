import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import RemoveIcon from "@/assets/icons/times-circle-svgrepo-com";
import { TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";
import userItem from "@/components/UserItem";
import UserItem from "@/components/UserItem";

export default function CreateChatUserList({
  participantId,
  onRemoveParticipant,
}) {
  return (
    <View
      className="px-10 m-1 flex-row justify-center items-center"
      style={{ height: hp(11), width: wp(100) }}
    >
      <FlashList
        keyExtractor={(item) => item}
        estimatedItemSize={80}
        horizontal={true}
        data={participantId}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="items-center mx-1 flex-1">
            <TouchableOpacity
              className="absolute top-0 right-0 z-10"
              onPress={() => {
                onRemoveParticipant(item);
              }}
            >
              <RemoveIcon height={hp(2)} width={hp(2)} />
            </TouchableOpacity>
            <UserItem id={item} />
          </View>
        )}
      />
    </View>
  );
}
