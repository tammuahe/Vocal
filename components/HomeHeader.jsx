import { Text, StatusBar, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuItem from "@/components/MenuItem";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function HomeHeader({ leftIcon, headerTitle }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { user, logout } = useAuth();
  useEffect(() => {
    const fetchAvatar = async () => {
      // const { data, error } = await supabase
      //     .from('profiles')
      //     .select('profile_picture')
      //     .eq('uuid', user.id)
      //     .single()

      // if (error) {
      //     console.error('Error fetching avatar:', error.message);
      //     setAvatarUrl(null)
      // }

      // if (data)
      // {
      //     setAvatarUrl(data.profile_picture);
      // }

      //console.log(data)
      Image.clearDiskCache();
      Image.clearMemoryCache();
      if (user?.id) {
        setAvatarUrl(
          "https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/" +
            user.id +
            "/" +
            user.id +
            ".jpeg"
        );
      }
    };

    fetchAvatar();
  }, [user]);

  // useEffect(() => {
  //   console.log("avatarUrl", avatarUrl);
  // }, [avatarUrl]);

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="p-5 flex-row justify-between pb-6 shadow" >
      <StatusBar style="light" />
      {leftIcon}

      <Text style={{ fontSize: hp(3) }} className="font-medium text-neutral-50">
        {headerTitle}
      </Text>

      <View>
        <Menu>
          <MenuTrigger>
            <Image
              style={{ height: hp(4.5), width: hp(4.5), borderRadius: 100 }}
              source={{ uri: avatarUrl }}
              placeholder={require("@/assets/images/default_avatar.png")}
              transition={100}
              contentFit="contain"
              allowDownscaling={false}
              cachePolicy={"memory"}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: 40,
                marginLeft: -20,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 0 },
                width: 180,
              },
            }}
          >
            <MenuItem
              text="Trang cá nhân"
              action={handleProfile}
              icon={<Feather name="user" size={hp(3)} color="darkblue" />}
            />

            <Divider />

            <MenuItem
              text="Đăng xuất"
              action={handleLogout}
              icon={
                <MaterialCommunityIcons
                  name="logout-variant"
                  size={hp(3)}
                  color="darkred"
                />
              }
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const Divider = () => {
  return <View className="p-[1px] w-[75%] self-center bg-neutral-200" />;
};
