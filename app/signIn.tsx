import React, { Component } from 'react'
import { Image, View, Text, ImageBackground, TextInput } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import InputField from '../components/InputField.jsx'




export default function SignIn() {
  {
    return (
      <>
        
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-skyblue">
            <StatusBar backgroundColor="#A9C6FA"/>
            <ImageBackground className="flex-1" 
            source={require('../assets/images/login_background.png')} resizeMode="cover">
            <View className='p-3'>
              <View className='items-center'>
                <Image style={{height: hp(25)}} resizeMode='contain' source={require('../assets/images/logo.png')} ></Image>
              </View>


              <View className='gap-5 items-center m-3'>
                <Text className='text-center font-bold tracking-wider text-neutral-800' style={{fontSize: hp(4)}}>
                  Đăng nhập vào Vocal
                </Text>
              </View>

              <View className='gap-4 m-3'>
                <InputField iconName={'email'} placeHolderText={'Email'} />
                <InputField iconName={'password'} placeHolderText={'Mật khẩu'} hideText={true} />
              </View>

              <Text style={{fontSize: hp(2)}} className='font-semibold text-right m-3'>Quên mật khẩu?</Text>
            </View>
            </ImageBackground>
          </SafeAreaView>
        </SafeAreaProvider>  
      </>
    )
  }
}
