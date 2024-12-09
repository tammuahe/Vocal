import React, { Component, useEffect, useState } from 'react'
import { Alert, Button, Text, View } from 'react-native'
import { useAuth } from "@/context/authContext";
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '@/components/Loading.jsx';
import ChatList from '@/components/ChatList'
import { supabase } from '@/lib/supabase'
import SharedLayout from '@/components/SharedLayout'
import CreateChatIcon from '@/assets/icons/create-note-svgrepo-com.svg';

export default function Home() {
  const  { user } = useAuth()
  
  const [users, setUsers] = useState([]);

  const getConversations = async () => {
    try {
      //console.log('getConver called');
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('participant_id',user.id)
  
      // console.log('data fetched');
  
      if (error) {
        console.error('Supabase error:', error);
      } else {
        setUsers(data);
        // console.log(data);
      }
      

    } catch (err) {
      console.error('Unexpected error:', err);
    }
    
  };

  useEffect(() => {
    // console.log('use effect triggered')
    const fetchData = async () => {
        await getConversations()
        // console.log('conversation after fetch', users)
    }

    if (user){
      fetchData()
    }

  },[user])


    return (
      <SharedLayout headerTitle="Cuộc trò chuyện" leftIcon={<CreateChatIcon width={32} height={32} fill="#fff"/>}>
          <View className='flex-1'>
            <StatusBar style='light' />
            {users.length > 0 ? (
              <ChatList users={users} />
            ):(
              <View className='flex items-center' style={{top: hp(30)}}>
                  <Loading size={hp(10)}/>
              </View>
            )}
          </View>
      </SharedLayout>
      
    )
  }

  
