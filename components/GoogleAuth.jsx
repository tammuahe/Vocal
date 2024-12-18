import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

export default function GoogleAuth() {
  GoogleSignin.configure({
    webClientId:
      "1027638585997-dqn82nanmhftdjrqdo87sjrlfcmgbtv3.apps.googleusercontent.com",
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo.data.idToken)
      if (userInfo.data.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        if (error){
          console.error('login error: ', error);
        } else{
          console.log(data)
        }
        
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error) {
      if (error) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Đăng nhập bằng Google','Vui lòng hoàn thành đăng nhập trước.')
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Đăng nhập bằng Google','Vui lòng cài đặt dịch vụ Google.')
            break;
          default:
          Alert.alert('Đăng nhập bằng Google','Đã có lỗi xảy ra. Vui lòng thử lại sau')
        }
      } else {
        Alert.alert('Đăng nhập bằng Google','Đã có lỗi xảy ra. Vui lòng thử lại sau')
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />
  );
}
