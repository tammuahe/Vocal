import React from 'react'
import { Stack } from 'expo-router'

import HomeHeader from '@/components/HomeHeader.jsx'
import { MenuProvider } from 'react-native-popup-menu';

export default function _layout() {
    return (
      <MenuProvider>
        <Stack>
          <Stack.Screen
            name='home' 
            options={{
              header: () => <HomeHeader />
            }}
            />
        </Stack>
      </MenuProvider>
    ) 
}
