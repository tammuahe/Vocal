import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function SubmitButton({submitButtonText, ...rest}) {
  return (
    <TouchableOpacity 
    {...rest} 
    className='bg-skyblue rounded-xl justify-center items-center' 
    style={{height: hp(6.5), width: wp(70)}}>

      <Text className='font-bold tracking-wider' style={{fontSize: hp(2.7)}}>
        {submitButtonText} 
      </Text>
      
    </TouchableOpacity>
  )
}