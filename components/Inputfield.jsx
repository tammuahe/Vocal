import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function InputField({title, placeholder, onPress}) {
  return (
    <View className='flex-row bg-lightgrey rounded-3xl my-7' style={{height: hp(8)}}>
      <TouchableOpacity className='pl-4 pt-3'>
        <Text className='font-inter font-medium text-lg'>{title}</Text>
        
      </TouchableOpacity>
    </View>
  )
}