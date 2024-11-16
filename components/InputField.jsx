import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function InputField({iconName, placeHolderText, hideText=false}) {
    return (
      <View style={{height: hp((7))}} className='ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey '>
        <MaterialIcons className='p-4' name={iconName} size={24} color="black" />
        <TextInput 
        secureTextEntry={hideText}
        style={{fontSize: hp(2)}}
        className='flex-1 font-semibold text-neutral-700 p-3'
        placeholder={placeHolderText}
        placeholderTextColor={'grey'}>
        </TextInput>
      </View>
    )
  }
