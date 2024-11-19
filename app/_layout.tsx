import { Slot, useSegments, useRouter } from "expo-router";
import "../global.css";
import { useAuth, AuthContextProvider } from "@/context/authContext";
import React, { useEffect } from "react";
import { supabase } from '../lib/supabase'
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout = () => {
  const {setAuth} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {

      if(session){
        setAuth(session?.user)
        router.replace('/home')
      }
      else{
        setAuth(null)
        router.replace('/signIn')
      }
    })
  },[])



  return <Slot />;
}

export default function _layout() {


  return(
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
    
}
