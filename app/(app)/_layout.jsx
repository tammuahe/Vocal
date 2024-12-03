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
            <Stack.Screen
              name='home' 
              options={{headerShown: false}}
              />
            <Stack.Screen name='listFriends' options={{headerShown: false} }/>
          </Stack>
        </MenuProvider>
      </AuthContextProvider>
    ) 
}
