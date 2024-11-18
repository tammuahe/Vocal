import { View, Text } from 'react-native'
import React from 'react'
import {
    MenuOption,
  } from 'react-native-popup-menu';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function MenuItem({text, action, value, icon}) {
  return (
    <MenuOption>
      <View className='px-4 py-1 flex-row justify-between items-center'>
        <Text style={{fontSize: hp(1.7)}} className='font-semibold text-neutral-500'>{text}</Text>
        {icon}
      </View>
    </MenuOption>
  )
}