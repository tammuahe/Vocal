import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../context/authContext";
import { Image } from "expo-image";
import { supabase } from "../lib/supabase";

import { blurhash } from "../utils/common";
export default function InboxHeader({
  conversationId,
  participantUsernames,
  participantId,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [participantAvatars, setParticipantAvatars] = useState([]);

  // console.log('conversationId: ', conversationId)
  // console.log('participantId: ', participantId)

  useEffect(() => {
    const fetchAvatar = async () => {
      // const { data, error } = await supabase
      //     .from('profiles')
      //     .select('profile_picture')
      //     .eq('uuid', user.id)
      //     .single()
      // //console.log('image', data.profile_picture)
      // if (error) {
      //     console.error('Error fetching avatar:', error.message);
      //     setAvatarUrl(null)
      // }

      // if (data)
      // {
      //     setAvatarUrl(data.profile_picture);

      // }
      setAvatarUrl(
        "https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/" +
          user.id +
          "/" +
          user.id +
          ".jpeg"
      );
    };

    fetchAvatar(), [];
  });

  const fetchParticipantAvatar = async (id) => {
    // const { data, error } = await supabase
    //     .from('profiles')
    //     .select('profile_picture')
    //     .eq('uuid', id)
    //     .single()

    // if (error) {
    //     console.error('Error fetching participant avatar:', error.message);
    //     return null
    // }

    // if (data)
    // {
    //     // console.log('partic image: ', data)
    //     return data.profile_picture;
    // }
    return (
      "https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/" +
      id +
      "/" +
      id +
      ".jpeg"
    );
  };
  useEffect(() => {
    const fetchParticipantAvatars = async () => {
      const avatars = await Promise.all(
        participantId.map((id) => fetchParticipantAvatar(id))
      );
      setParticipantAvatars(avatars);
    };

    if (participantId && participantId.length > 0) {
      fetchParticipantAvatars();
    }
    // console.log('participantAvatars', participantAvatars)
  }, [participantId]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Stack.Screen
      options={{
        headerStyle: {
          backgroundColor: "#F86565",
        },
        title: "",

        headerLeft: () => (
          <View className="flex-row items-center gap-4 ">
            <TouchableOpacity onPress={handleBack}>
              <AntDesign name="back" size={hp(3.5)} color="#428DF0" />
            </TouchableOpacity>
            <FlatList
              className="rounded-2xl "
              style={{
                flexGrow: 0,
                width: wp(30),
              }}
              horizontal={true}
              data={participantAvatars}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  style={{
                    flex: 1,
                    margin: 2,
                    height: hp(4.5),
                    width: hp(4.5),
                    borderRadius: 100,
                  }}
                  source={{ uri: item }}
                  contentFit="contain"
                  placeholder={require("@/assets/images/default_avatar.png")}
                  transition={100}
                  allowDownscaling={true}
                  cachePolicy={"memory"}
                />
              )}
            />
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4 ">
            <TouchableOpacity onPress={() => {}}>
              <Image
                style={{
                  margin: 2,
                  height: hp(4.5),
                  width: hp(4.5),
                  borderRadius: 100,
                }}
                source={{ uri: avatarUrl }}
                placeholder={{ blurhash }}
                contentFit="contain"
                allowDownscaling={false}
                cachePolicy={"memory-disk"}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}
