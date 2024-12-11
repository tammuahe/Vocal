import React from 'react'
import { Stack } from 'expo-router'
import { AuthContextProvider } from '@/context/authContext';
import HomeHeader from '@/components/HomeHeader.jsx';
import { MenuProvider } from 'react-native-popup-menu';

export default function _layout() {
    return (
      <AuthContextProvider>
        <MenuProvider>
          <Stack>
            <Stack.Screen name='home' options={{headerShown: false}}/>
            <Stack.Screen name='addFriend' options={{headerShown: false} }/>
            <Stack.Screen name='listFriends' options={{headerShown: false} }/>
            <Stack.Screen name='settings' options={{headerShown: false} }/>
            <Stack.Screen name='notifyAndSound' options={{headerShown: false} }/>
            <Stack.Screen name='privacyAndSecurity' options={{headerShown: false} }/>
            <Stack.Screen name='listSentFriendRequest' options={{headerShown: false} }/>
          </Stack>
        </MenuProvider>
      </AuthContextProvider>
    ) 
}
