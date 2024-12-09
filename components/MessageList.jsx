import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import InboxBubble from './InboxBubble'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/authContext'


export default function MessageList({conversationId, anyMessage}) {
  const [messages, setMessages] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('sender_id, message_text, message_attachment, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) {
        console.error('Error fetching messages:', error.message);
        return;
      }
      if (data) setMessages(data);
      hasAnyMessage(data);
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('messageStream')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const { sender_id, message_text, message_attachment, created_at } = payload.new;
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender_id, message_text, message_attachment, created_at },
          ]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Kiểm tra đã có tin nhắn nào trong đoạn chat chưa
  const hasAnyMessage = (data) => {
    if(data?.length == 0) {
      anyMessage(false);
    }else {
      anyMessage(true);
    }
  }
  // useEffect(() => {
  //   console.log(messages)
  // },[messages])


 
  
// useEffect(()=>{
//   console.log("User:", user);
//   console.log("User ID:", user?.id); 
// },[user])

  return (
    <FlatList
      inverted
      data={[...messages].reverse()}
      showsVerticalScrollIndicator={false}
      renderItem={
        ({item}) => (<InboxBubble data={{...item, isUser: user.id === item.sender_id}}/>)
      } 
    />  
  )

}