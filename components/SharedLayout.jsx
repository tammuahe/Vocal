import { LinearGradient } from "expo-linear-gradient";
import { View, Text,  } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import NavIcon from "../assets/icons/nav-icon-a-svgrepo-com.svg";
import ChatRoundIcon from "../assets/icons/chat-round-line-svgrepo-com.svg";
import UsersIcon from "../assets/icons/users-svgrepo-com.svg";
import SettingsIcon from "../assets/icons/settings-svgrepo-com.svg";
import { Link, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import React from "react";
import HomeHeader from "./HomeHeader";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function SharedLayout({
  children,
  headerTitle,
  leftIcon,
  showNavBottom = true,
  ...res
}) {
  const router = useRouter();
  const route = useRoute();
  return (
    // <View {...res}>
    <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
        <StatusBar style="light" />
        <SafeAreaView className="flex-1">
        <HomeHeader
          leftIcon={leftIcon}
          headerTitle={headerTitle}
        />

        <View className="flex-1 px-4">{children}</View>
        {
          showNavBottom && (
            <SafeAreaView>
              <View className="absolute left-0 bottom-0 h-16 px-4 flex-row items-center bg-[#97D7FF]">
                <View
                  className={
                    (route.name == "home" ? "border-t border-white " : " ") +
                    "w-1/3 h-full flex items-center justify-center"
                  }
                >
                  <ChatRoundIcon
                    onPress={() => {
                      if (route.name != "home") router.replace("/(app)/home");
                    }}
                  />
                </View>
                <View
                  className={
                    (route.name == "listFriends" ? "border-t border-white " : " ") +
                    "w-1/3 h-full flex items-center justify-center"
                  }
                >
                  <UsersIcon
                    onPress={() => {
                      if (route.name != "listFriends")
                        router.push("/(app)/listFriends");
                    }}
                  />
                </View>
                <View
                  className={
                    (route.name == "settings" ? "border-t border-white " : " ") +
                    "w-1/3 h-full flex items-center justify-center"
                  }
                >
                  <SettingsIcon onPress={() => {
                    if(router.name != 'settings') {
                      router.push('/(app)/settings');
                    }
                  }}/>
                </View>
              </View>
            </SafeAreaView>
          )
        }
        </SafeAreaView>
      </LinearGradient>
    // </View>
  );
}
