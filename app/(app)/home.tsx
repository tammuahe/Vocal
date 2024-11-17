import React, { Component } from 'react'
import { Alert, Button, Text, View } from 'react-native'
import { useAuth, AuthContextProvider } from "@/context/authContext";
import { supabase } from '@/lib/supabase';

export default function Home() {
  const {setAuth} = useAuth()
  const onLogout = async () => {
    setAuth(null);
    const {error} = await supabase.auth.signOut()
    if(error){
      Alert.alert('Đăng xuất','Không thể đăng xuất.')
    }
  }
    return (
      <View>
        <Text> authenticated </Text>
        <Button title='logout' onPress={onLogout} />
      </View>
    )
  }

