import { Slot, useSegments, useRouter } from "expo-router";
import "../global.css";
import { useAuth, AuthContextProvider } from "@/context/authContext";
import React, { useEffect } from "react";
import { supabase } from '../lib/supabase'

const MainLayout = () => {
  const {setAuth} = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
    
      if(session){
        setAuth(session?.user)
        router.replace('/home')
        //replaced with /profile for easier debugging. Replace with /home after done.
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
