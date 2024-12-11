import React from "react";
import { Stack } from "expo-router";
import { AuthContextProvider } from "@/context/authContext";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function _layout() {
  return (
    
    <AuthContextProvider>
      <MenuProvider>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="addFriend" options={{ headerShown: false }} />
            <Stack.Screen name="listFriends" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
        </GestureHandlerRootView>
      </MenuProvider>
    </AuthContextProvider>

  );
}
