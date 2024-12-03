import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/authContext';
import { decode } from 'base64-arraybuffer';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Stack, useRouter } from 'expo-router';

export default function profile() {
  const router = useRouter()
  const { user } = useAuth()
  const [profilePicture, setProfilePicture] = useState()
  const [path, setPath] = useState()
  const [userInfo, setUserInfo] = useState()

  const getProfileInfo = async () => {
    try {
      console.log('getProfileInfo called');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('uuid', user.id)
        .single();
  
      if (error) {
        console.error('Supabase error:', error);
      } else {
        if (data) {
          setUserInfo(data)
          console.log('profile info fetched:', userInfo);
          console.log('name info fetched:', userInfo?.user_name);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { day:'2-digit', month:'2-digit', year:'numeric' }); 
  };

  useEffect(()=>{
    setPath(`${user.id}/${user.id}.jpeg`)
    setProfilePicture(`https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/${user.id}/${user.id}.jpeg`)
    getProfileInfo()
  }, [user])

  const handleUpload = async () => {
    try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 0.6,
      exif: false
    })

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User cancelled image picker.')
      return
    }

    
    
    const img = result.assets[0]
    console.log('Got image', img)
    const arraybuffer = await FileSystem.readAsStringAsync(img.uri, {encoding: FileSystem.EncodingType.Base64})   
    const fileExt = 'jpeg' 
    console.log('Image object:', img.uri);
    console.log('File extension:', fileExt);
    console.log('Path:', path);

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, decode(arraybuffer), {
        contentType: img.mimeType ?? 'image/jpeg',
        upsert: true,
        metadata:{
          path: path,
          user_id: user.id
        }
      })

      if (uploadError) {
        throw uploadError
      }
      console.log('data: ', data )

    } catch (error) {
        if (error) {
          console.error(error)
        } else {
          throw error
        }
      }
      Image.clearDiskCache()
      Image.clearMemoryCache()
  }

  return (
    <>
    <Stack.Screen 
      options={{
        title:'Trang cá nhân',
        headerStyle:{
          backgroundColor:'#F86565'
        },
        headerTintColor:'#fff',
        headerTitleStyle: { 
          fontWeight: '500',

         }
      }}
    />
    <View className='flex-1 items-center p-5'>
      <View className='p-4 mt-2'>
      <Image
        style={{height: hp(15), width:hp(15), borderRadius: 100}}
        source={{uri: profilePicture}}
        contentFit='cover'
        allowDownscaling={true}
      />
      <TouchableOpacity 
      className='absolute bottom-1 right-1'
      onPress={handleUpload}
      > 
        <Feather name="edit" size={24} color="black" />
      </ TouchableOpacity>
      </View>
      {userInfo?.user_name && <Text className='font-normal'>@{userInfo?.user_name}</Text>}

      <View className='border flex-row w-[90%] p-5'>
        {(!userInfo?.bio && !userInfo?.gender) && <Text>Người dùng này chưa hiển thị thông tin nào!</Text>}
        {userInfo?.bio && (<Text>"{userInfo.bio}"</Text>)}
        {userInfo?.gender && (<Text>Giới tính: {userInfo.gender}</Text>)}
        
      </View>
      {userInfo?.created_at && (<Text className='ml-auto mr-0'>Gia nhập từ: {formatDate(userInfo?.created_at)}</Text>)}
      <View className='gap-4 m-3'>

      </View>
    </View>
    </>
  )
}