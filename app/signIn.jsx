import React, { Component, useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  ImageBackground,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import SubmitButton from "../components/SubmitButton.jsx";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "../components/Loading.jsx";
import CustomKeyboardView from "../components/CustomKeyboardView.jsx";
import { useAuth } from "@/context/authContext.js";
import { TouchableOpacity } from "react-native";
import GoogleAuth from "@/components/GoogleAuth.jsx"

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Đăng nhập", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    const { error } = await login(
      emailRef.current.trim(),
      passwordRef.current.trim()
    );

    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        Alert.alert("Đăng nhập", "Thông tin đăng nhập không chính xác.");
      } else {
        Alert.alert("Đăng nhập", "Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-skyblue">
        <StatusBar backgroundColor="#A9C6FA" />

        <ImageBackground
          className="flex-1"
          source={require("../assets/images/login_background.png")}
          resizeMode="cover"
        >
          <CustomKeyboardView>
            {/*logo*/}

            <View className="p-3">
              <View className="items-center m-10">
                <Image
                  style={{ height: hp(15) }}
                  resizeMode="contain"
                  source={require("../assets/images/logo.png")}
                ></Image>
              </View>

              <View className="gap-5 items-center m-3">
                <Text
                  className="text-center font-bold tracking-wider text-neutral-800"
                  style={{ fontSize: hp(4) }}
                >
                  Đăng nhập vào Vocal
                </Text>
              </View>

              {/*input fields*/}
              <View className="gap-4 m-3">
                <View
                  style={{ height: hp(7) }}
                  className="ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey"
                >
                  <MaterialIcons
                    className="p-4"
                    name="email"
                    size={24}
                    color="black"
                  />
                  <TextInput
                    onChangeText={(value) => (emailRef.current = value)}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700 p-3"
                    placeholder="Email"
                    placeholderTextColor={"grey"}
                  />
                </View>

                <View
                  style={{ height: hp(7) }}
                  className="ml-3 mr-3 items-center rounded-lg flex-row bg-lightgrey"
                >
                  <MaterialIcons
                    className="p-4"
                    name="password"
                    size={24}
                    color="black"
                  />
                  <TextInput
                    textContentType="password"
                    onChangeText={(value) => (passwordRef.current = value)}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700 p-3"
                    placeholder="Mật khẩu"
                    placeholderTextColor={"grey"}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              <Text
                style={{ fontSize: hp(2) }}
                className="font-semibold text-right m-3"
              >
                Quên mật khẩu?
              </Text>

              {/*Submit button*/}
              <View className="flex-row justify-center">
                {loading ? (
                  <Loading size={hp(10)} />
                ) : (
                  <View className="items-center m-5">
                    <SubmitButton
                      submitButtonText={"Đăng nhập"}
                      onPress={handleLogin}
                    />
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-center">
                <GoogleAuth />
              </View>

              {/*register text*/}
              <View className="flex-row justify-center mt-10">
                <Text
                  className="font-semibold text-neutral-900"
                  style={{ fontSize: hp(1.8) }}
                >
                  Chưa có tài khoản?
                </Text>

                <Pressable
                  onPress={() => {
                    router.push("/signUp");
                  }}
                >
                  <Text
                    className="font-bold text-indigo-500"
                    style={{ fontSize: hp(1.8) }}
                  >
                    {" "}
                    Đăng ký{" "}
                  </Text>
                </Pressable>
              </View>
            </View>
          </CustomKeyboardView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
