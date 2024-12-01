import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import InboxHeader from '../../components/InboxHeader'
import MessageList from '../../components/MessageList'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/authContext'

export default function Inbox() {
  const {user} = useAuth()
  const item = useLocalSearchParams()
  const userId = user.id
  const [conversationId, setConversationId] = useState(item['conversation_id'])
  const [participantId, setParticipantId] = useState(item['participants_id'].split(','))
  const [message, setMessage] = useState('')
  // console.log('conversationId: ', conversationId)
  // console.log('participantUsernames: ',participantUsernames)
  // console.log('participantId: ', participantId)

  //console.log('item data: ', item['conversation_id'])

  const handleSendMessage = async () => {
    const messageText = message.trim()
    console.log('messageText: ', messageText)
    setMessage('')
    if (!messageText) {return}
    try {
    console.log('handleSendMessage called');
    const { error } = await supabase
      .from('conversation_messages')
      .insert({
        message_text: messageText,
        conversation_id: conversationId,
        sender_id: userId
      })
    console.log('tried to send message');

    if (error) {
      console.error('Supabase error:', error);
    }
  
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  return (
    <View className='flex-1 bg-lightblue'>
      <StatusBar style='dark' />
      <InboxHeader conversationId={conversationId} participantId={participantId} />
      <View className='flex-1 justify-between overflow-visible'>
        <View className='flex-1 ml-3 mr-4 '>
          <MessageList conversationId={item['conversation_id']}/>
        </View>
        <View style={{marginBottom: hp(1.6)}} className='pt-2'>
          <View className='flex-row justify-between items-center mx-3' style={{height: hp(9)}}>
            <View className='flex-row content-around items-center bg-white border border-darkred pl-4 pr-4 rounded-full m-2 my-1'>
              <TextInput
                value={message}
                onChangeText={value => setMessage(value) }
                placeholder='Nhập tin nhắn...'
                style={{fontSize: hp(2)}}
                className='flex-1 mr-2'
              />
              <TouchableOpacity onPress={handleSendMessage} className='p-2 mr-[1px] rounded-full items-center'>
                <FontAwesome name="send" size={hp(2.7)} color="#F86565" />
              </TouchableOpacity>
              
            </View>
          </View>

        </View>
      </View>
    </View>
  )
}