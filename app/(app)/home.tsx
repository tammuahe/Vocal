import React, { Component } from 'react'
import { Alert, Button, Text, View } from 'react-native'
import { useAuth } from "@/context/authContext";

export default function Home() {
  const { logout } = useAuth()
  const onLogout = async () => {
    logout()
  }
    return (
      <View>
        <Text> authenticated </Text>
      </View>
    )
  }

