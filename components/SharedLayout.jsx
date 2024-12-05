import { LinearGradient } from "expo-linear-gradient";
import { View, Text, SafeAreaView } from "react-native";
import NavIcon from "../assets/icons/nav-icon-a-svgrepo-com.svg";
import ChatRoundIcon from "../assets/icons/chat-round-line-svgrepo-com.svg";
import UsersIcon from "../assets/icons/users-svgrepo-com.svg";
import SettingsIcon from "../assets/icons/settings-svgrepo-com.svg";
import { Link, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import React from "react";
import HomeHeader from "./HomeHeader";

export default function SharedLayout({ children, headerTitle, leftIcon }) {
  const router = useRouter();
  const route = useRoute();
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient className="h-screen" colors={["#FFB9B9", "#A0C8FC"]}>
        <HomeHeader
          leftIcon={leftIcon}
          headerTitle={headerTitle}
        />

        <View className="flex-1 px-4">{children}</View>

        <SafeAreaView className="h-16 px-4  flex-row items-center bg-[#97D7FF]">
          <View
            className={
              (route.name == "home" ? "border-t border-white " : " ") +
              "w-1/3 h-full flex items-center justify-center"
            }
          >
            <ChatRoundIcon
              onPress={() => {
                if (route.name != "home") router.push("/(app)/home");
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
            <SettingsIcon />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaView>
  );
}
