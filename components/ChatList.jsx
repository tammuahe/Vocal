import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import ChatItem from '@/components/ChatItem'
export default function ChatList({users}) {
  // console.log('users in chatlist', users)
  return (
    <View className='flex-1'>
      <FlatList
        data={users}
        contentContainerStyle={{flex:1, paddingVertical: 25}}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => <ChatItem  item={item} index={index} />}
      />
    </View>
  )
}