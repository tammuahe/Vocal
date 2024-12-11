import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import ChatItem from '@/components/ChatItem'
export default function ChatList({users}) {
  return (
    <View className='flex-1'>
      <FlatList
        data={users}
        contentContainerStyle={{flex:1, paddingVertical: 25}}
        keyExtractor={item => item.conversation_id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <ChatItem  item={item}/>}
      />
    </View>
  )
}