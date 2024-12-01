import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/authContext';
import { decode } from 'base64-arraybuffer';

export default function profile() {
  const { user } = useAuth()
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
    const path = `${user.id}/${user.id}.${fileExt}`
    console.log('Image object:', img.uri);
    console.log('File extension:', fileExt);
    console.log('Path:', path);
    console.log('user id: ', user.id)

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

  }

  return (
    <TouchableOpacity 
    className='m-auto items-center align-middle'
    onPress={handleUpload}
    > 
      <AntDesign name="upload" size={100} color="black" />
    </ TouchableOpacity>
  )
}