import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
export default function ChatItem(item) {
  const [conversationImage, setConversationImage] = useState()
  const [participants, setParticipants] = useState([])
  const [participantsUsernames, setParticipantsUsernames] = useState([])
  const [conversationTitle, setConversationTitle] = useState('Cuộc trò chuyện không tên') 
  const [lastTime, setLastTime] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const router = useRouter()
  useEffect(() => {
    //console.log('chat item item prop', item.item.conversation_id)

    getConversationsPicture()
    getParticipants()
    getTime()
    getLastmessage()
  }, [item])

  const getConversationsPicture = async () => {
    try {
      //console.log('getConverpic called');
      const { data, error } = await supabase
        .from('conversations')
        .select('conversation_picture')
        .eq('id',item.item.conversation_id)
        .single()
        
      if (error) {
        console.error('Supabase error:', error);
      } else {
        //console.log('convopic fetched:',data['conversation-picture']);
        setConversationImage(data['conversation_picture']) 
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  useEffect(()=>{
    //console.log('participants usestate', participants)
    participants.forEach(
      async (item) => {await getParticipantsUsername(item['participant_id'])}
    )
  },[participants])

  const usernamesToString = (list) => {
    // If the list is empty, return an empty string or a default string like "No participants"
    if (list.length === 0) {
      return "No participants";
    }
  
    let string = '';
    list.forEach((element, index) => {
      if (index === list.length - 1) {
        string += element;
      } else {
        string += element + ', ';
      }
    });
    return string;
  };

  useEffect(() => {
    const newTitle = usernamesToString(participantsUsernames);
  
    // Only update state if the new title is different from the current title
    if (newTitle !== conversationTitle) {
      setConversationTitle(newTitle);
    }
  }, [participantsUsernames, conversationTitle]);

  // useEffect(() => {
  //   console.log('username list: ', participantsUsernames);
  // }, [participantsUsernames]);

  const getParticipants = async () => {
    try {
      //console.log('getParticipants called');
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('participant_id')
        .eq('conversation_id',item.item.conversation_id)
        //console.log('participants fetched:',data);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setParticipants(data)
        
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }



  const getParticipantsUsername = async (userId) => {
    try {
      //console.log('getParticipantsUsername called');
      const { data, error } = await supabase
        .from('profiles')
        .select('user_name')
        .eq('uuid', userId)
        .single();
  
      if (error) {
        console.error('Supabase error:', error);
      } else {
        if (data?.user_name) {
          setParticipantsUsernames((prevState) => {
            if (!prevState.includes(data.user_name)) {
              return [...prevState, data.user_name];
            }
            return prevState;
          });
          //('username fetched:', data.user_name);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();  // Formats as "MM/DD/YYYY, HH:MM:SS AM/PM" (depends on locale)
  };

  const getTime = async () => {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('created_at')
        .eq('conversation_id',item.item.conversation_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error) {
        //('lastime', formatDate(data['created_at']))
        setLastTime(formatDate(data['created_at']))
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  const getLastmessage = async () => {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('message_text')
        .eq('conversation_id',item.item.conversation_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error) {
        //console.log('last mess', data['message_text'])
        setLastMessage(data['message_text'])
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  const openInbox = () => {
    router.push({pathname: '/inbox', param: item})
  }

  return (
   
    <TouchableOpacity 
    className='flex-row justify-between mx-4 items-center gap-3 mb-4 p-4 border-neutral-950 overflow-hidden bg-white rounded-2xl'
    onPress={() => {openInbox()}}
    > 
        <Image
            source={conversationImage}
            style={{height: hp(5), width: hp(5), borderRadius: 100}}
            contentFit='contain'
            placeholder={require('../assets/images/default-conversation.png')}
            
        />
        <View className='flex-1 gap-1'>
            <View className='flex-row justify-between'>
                <Text style={{fontSize: hp(1.8)}} className='font-semibold text-neutral-800'>{conversationTitle}</Text>
                <Text style={{fontSize: hp(1.6)}} className='font-medium text-skyblue'>{lastTime}</Text>
            </View>
            <Text style={{fontSize: hp(1.6)}} className='font-medium text-neutral-500'>{lastMessage}</Text>
        </View>
    </TouchableOpacity>
  )
}