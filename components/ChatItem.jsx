import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';

export default function ChatItem() {
  return (
    <TouchableOpacity className='flex-row justify-between mx-4 items-center gap-3 mb-4 p-4 border-neutral-950 overflow-hidden bg-white rounded-2xl'> 
        <Image
            source={require('@/assets/images/logo.png')}
            style={{height: hp(5), width: hp(5), borderRadius: 100}}
            contentFit='contain'
            
        />
        <View className='flex-1 gap-1'>
            <View className='flex-row justify-between'>
                <Text style={{fontSize: hp(1.8)}} className='font-semibold text-neutral-800'>User</Text>
                <Text style={{fontSize: hp(1.6)}} className='font-medium text-skyblue'>Time</Text>
            </View>
            <Text style={{fontSize: hp(1.6)}} className='font-medium text-neutral-500'>Last message</Text>
        </View>
    </TouchableOpacity>
  )
}