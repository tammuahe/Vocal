import React, { useRef, useState } from 'react'
import { Image, View, Text, ImageBackground, Pressable, Alert, TextInput } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import SubmitButton from '../components/SubmitButton.jsx'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import Loading from '../components/Loading.jsx';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomKeyboardView from '../components/CustomKeyboardView.jsx'
import { supabase } from '../lib/supabase.ts'
import { useAuth } from '../context/authContext.js'

export default function SignUp() {
  const router = useRouter()
  const{ register } = useAuth()
  const [loading, setLoading] = useState(false)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const userNameRef = useRef(null)



  const handleRegister = async () => {
      if (!emailRef.current || !passwordRef.current || !userNameRef.current ){
        Alert.alert('Đăng ký','Vui lòng nhập đầy đủ thông tin.')
        return
      }


      setLoading(true)

      let response = await register(emailRef.current.trim(), passwordRef.current.trim(), userNameRef.current.trim())

      setLoading(false)

      console.log(response)

      if (error){
        Alert.alert('Đăng ký', error.message)
      }
      return
  }

    return (
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-skyblue">

            <StatusBar backgroundColor="#A9C6FA"/>
            <ImageBackground className="flex-1" 
            source={require('../assets/images/login_background.png')} resizeMode="cover">
            
            <CustomKeyboardView>

            {/*logo*/}

              <View className='p-3'>
                <View className='items-center'>
                  <Image style={{height: hp(15)}} resizeMode='contain' source={require('../assets/images/logo.png')} ></Image>
                </View>

                <View className='gap-5 items-start m-6'>
                  <Text className='text-center font-bold tracking-wider text-neutral-800' style={{fontSize: hp(4)}}>
                    Đăng ký
                  </Text>
                </View>

                {/*input fields*/}
                <View className='gap-4 m-3'>
                  
                  <View style={{ height: hp(7) }} className="ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey">
                    <FontAwesome5 className="p-4" name='user' size={24} color="black" />
                    <TextInput 
                      onChangeText={value => userNameRef.current = value}
                      style={{ fontSize: hp(2) }}
                      className="flex-1 font-semibold text-neutral-700 p-3"
                      placeholder='Tên tài khoản'
                      placeholderTextColor={'grey'}
                    />
                  </View>
                    
                  <View style={{ height: hp(7) }} className="ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey">
                    <MaterialIcons className="p-4" name='email' size={24} color="black" />
                    <TextInput 
                      onChangeText={value => emailRef.current = value}
                      inputMode='email'
                      style={{ fontSize: hp(2) }}
                      className="flex-1 font-semibold text-neutral-700 p-3"
                      placeholder='Email'
                      placeholderTextColor={'grey'}
                    />
                  </View>
                    

                  <View style={{ height: hp(7) }} className="ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey">
                    <MaterialIcons className="p-4" name='password' size={24} color="black" />
                    <TextInput 
                      textContentType='password'
                      onChangeText={value => passwordRef.current = value}
                      style={{ fontSize: hp(2) }}
                      className="flex-1 font-semibold text-neutral-700 p-3"
                      placeholder='Mật khẩu'
                      placeholderTextColor={'grey'}
                      secureTextEntry={true}
                    />
                  </View>

                </View>
                

                {/*Submit button*/}
                <View className="flex-row justify-center">
                  {
                    loading ? (
                      <Loading size={hp(10)} />
                    ):(
                      <View className='items-center m-8'>
                        <SubmitButton submitButtonText={'Đăng ký'} onPress={handleRegister}/>
                      </View>
                    )
                  }
                </View>
                
                {/*register text*/}
                <View className='flex-row justify-center'>

                  <Text className='font-semibold text-neutral-900' style={{fontSize:hp(1.8)}}>Đã có tài khoản?</Text>

                  <Pressable onPress={() => {router.push('/signIn')}}>
                    <Text className='font-bold text-indigo-500' style={{fontSize:hp(1.8)}}> Đăng nhập </Text>
                  </Pressable>
                </View>
                
              </View>
              
              </CustomKeyboardView>
            </ImageBackground>
          </SafeAreaView>
        </SafeAreaProvider>  
    )
  
}
