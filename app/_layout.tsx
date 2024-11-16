import { Slot, useSegments, useRouter } from "expo-router";
import "../global.css";
import { useAuth, AuthContextProvider } from "@/context/authContext";
import React, { useEffect } from "react";

const MainLayout = () => {
  const {isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0] == '(app)';
    if (isAuthenticated && !inApp){
        //redirect to home
        router.replace("/home");
    } else if (isAuthenticated==false){
      // redirect to signIn
        router.replace('/signIn');
    }
  }, [isAuthenticated])

  return <Slot />;
}

export default function RootLayout() {
  return(
  <AuthContextProvider>
    <MainLayout />
  </AuthContextProvider>
  )
    
}
