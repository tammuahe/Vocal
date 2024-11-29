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
    getConversationsPicture();
    getParticipants();
  
    // Fetch initial last message and time
    const fetchLastMessageAndTime = async () => {
      try {
        const { data, error } = await supabase
          .from('conversation_messages')
          .select('message_text, created_at')
          .eq('conversation_id', item.item.conversation_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
  
        if (!error && data) {
          setLastMessage(data.message_text);
          setLastTime(formatDate(data.created_at));
        }
      } catch (err) {
        console.error('Error fetching last message and time:', err);
      }
    };
  
    fetchLastMessageAndTime();
  
    // Subscribe to real-time updates for new messages
    const channel = supabase
      .channel('messageUpdates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${item.item.conversation_id}`,
        },
        (payload) => {
          const { message_text, created_at } = payload.new;
          setLastMessage(message_text);
          setLastTime(formatDate(created_at));
        }
      )
      .subscribe();
  
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.item.conversation_id]);
  

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

    if (list.length === 0) {
      return "";
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




  const openInbox = () => {
    router.push({
      pathname: '/inbox', 
      params: {
      conversation_id: item.item.conversation_id,
      participantsUsernames,
      participants_id: participants.flatMap(Object.values)
    } 
  })
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
            <Text
              style={{ fontSize: hp(2), maxWidth: wp(45) }}
              ellipsizeMode="tail"
              numberOfLines={1}
              className="font-semibold text-neutral-800"
            >{conversationTitle}</Text>
                <Text style={{fontSize: hp(1.3)}} className='font-medium text-skyblue'>{lastTime}</Text>
            </View>
            <Text style={{fontSize: hp(1.6)}} className='font-medium text-neutral-500'>{lastMessage}</Text>
        </View>
    </TouchableOpacity>
  )
}