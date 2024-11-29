import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { supabase } from '../lib/supabase';


export default function InboxBubble(data) {
  //console.log('item: ', data.data)
  const [senderImage, setSenderImage] = useState()
  const { 
    created_at: sendTime, 
    message_attachment: messageAttachment, 
    message_text: messageText, 
    sender_id: senderId,
    isUser} = data.data
  // console.log('senderId: ', senderId)
  // console.log('messageText: ', messageText)
  // console.log('messageAttachment: ', messageAttachment)
  // console.log('sendTime: ', sendTime)

  const fetchSenderAvatar = async () => {

    const { data, error } = await supabase
        .from('profiles')
        .select('profile_picture')
        .eq('uuid', senderId)
        .single()

    if (error) {
        //console.error('Error fetching sender avatar:', error.message);
    }
    
    if (data)
    {  
        //console.log('sender image: ', data)
        setSenderImage(data.profile_picture);
    }
}

  useEffect(()=>{
    fetchSenderAvatar()
  },[])

  // useEffect(()=>{console.log('senderImage: ', senderImage)},[senderImage])

  if (isUser){
    return(
      <View className='flex-row items-end ml-auto mr-0'>
      <View className='bg-skyblue m-2 p-4 rounded-t-3xl rounded-bl-3xl w-auto inline-block max-w-[80%]'>
        <Text>{messageText}</Text>
      </View>
      <View>
        <Image
          style={{height: hp(4.5), width:hp(4.5), borderRadius: 100}}
          source={{uri: senderImage}}
          transition={100}
          contentFit='contain'
          allowDownscaling={false}
          cachePolicy={'memory-disk'}
        />
      </View>
    </View>)
  }
  else{
    return (
      <View className='flex-row items-end float-left'>
        <View>
          <Image
            style={{height: hp(4.5), width:hp(4.5), borderRadius: 100}}
            source={{uri: senderImage}}
            transition={100}
            contentFit='contain'
            allowDownscaling={false}
            cachePolicy={'memory-disk'}
          />
        </View>
        <View className='bg-verylightred m-2 p-4 border border-neutral-400 rounded-t-3xl rounded-br-3xl w-auto inline-block max-w-[80%]'>
          <Text>{messageText}</Text>
        </View>
      </View>
      )
  }
}