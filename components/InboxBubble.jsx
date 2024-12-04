import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { supabase } from '../lib/supabase';


export default function InboxBubble(data) {
  const [timeIsVisible, setTimeIsVisible] = useState()
  //console.log('item: ', data.data)
  const [senderImage, setSenderImage] = useState()
  const [senderUsername, setSenderUsername] = useState(true)
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

    // const { data, error } = await supabase
    //     .from('profiles')
    //     .select('profile_picture')
    //     .eq('uuid', senderId)
    //     .single()

    // if (error) {
    //     //console.error('Error fetching sender avatar:', error.message);
    // }
    
    // if (data)
    // {  
    //     //console.log('sender image: ', data)
    //     setSenderImage(data.profile_picture);
    // }
    setSenderImage('https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/' + senderId + '/' + senderId + '.jpeg')
}

const fetchSenderUsername = async () => {

  const { data, error } = await supabase
      .from('profiles')
      .select('user_name')
      .eq('uuid', senderId)
      .single()

  if (error) {
      console.error('Error fetching sender usename:', error.message);
  }
  
  if (data)
  {  
      //console.log('sender username: ', data)
      setSenderUsername(data['user_name']);
  }
}

  useEffect(()=>{
    fetchSenderAvatar()
    if(!isUser)
    {
      fetchSenderUsername()
    }
  },[])

  // useEffect(()=>{console.log('senderImage: ', senderImage)},[senderImage])

  const handlePressMessage = () => {
    setTimeIsVisible(!timeIsVisible)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    // Check if the date is within the same day
    const isSameDay = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    if (isSameDay) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); 
    } else {
      return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false, day:'2-digit',month:'2-digit' });
    }
  };
  

  if (isUser){
    return(
      <View>
        <TouchableOpacity className='flex-row items-end ml-auto m-1 mr-0' onPress={handlePressMessage}>
          <View className='bg-skyblue m-1 p-3 rounded-t-2xl rounded-bl-2xl w-auto block max-w-[80%] mb-0'>
            <Text>{messageText}</Text>
          </View>
        </TouchableOpacity>
        {timeIsVisible && 
        <View className='flex-row items-end ml-auto mr-0 mt-0 mb-1'>
          <Text>{formatDate(sendTime)}</Text>
        </View>}
        
      </View>)
  }
  else{
    return (
      <View>
        <View className='flex-row m-1'>
            <View className='flex-col justify-end items-center m-1'>
              <Image
                style={{height: hp(3.9), width:hp(3.9), borderRadius: 100}}
                source={{uri: senderImage}}
                placeholder={require('@/assets/images/default_avatar.png')}
                contentFit='cover'
                cachePolicy={'memory'}
                allowDownscaling={true}
              />
            </View>

            <View className='flex-1'>
              <View className='block pl-4'>
                <Text>{senderUsername}</Text>
              </View>
                <TouchableOpacity className="bg-verylightred mb-1 p-3 border border-neutral-400 rounded-t-2xl rounded-br-2xl max-w-[80%]"
                style={{ alignSelf: 'flex-start' }} onPress={handlePressMessage}>
                  <Text>{messageText}</Text>
                </TouchableOpacity>
                
            </View>
        </View>

        {timeIsVisible && 
        <View className='flex-row items-start mr-auto mt-0 mb-1' style={{marginLeft:hp(5)}}>
          <Text>{formatDate(sendTime)}</Text>
        </View>}
      </View>
      )
  }
}