import { Pressable, Text, View } from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";
import BellIcon from '../../assets/icons/bell-notify.svg'
import SecurityIcon from '../../assets/icons/security.svg'
import LogOutIcon from '../../assets/icons/log-out.svg'
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import ModalApp from "../../components/Modal";
import { useState } from "react";

export default function Settings(){
    const router = useRouter();
    const {logout} = useAuth();
    const [isvisible, setIsvisible] = useState(false);
    function openModalLogout() {
        setIsvisible(true);
    }
    function closeModalLogout() {
        setIsvisible(false);
    }
    return (
        // <View className="flex-1 ">
            <LinearGradient style={{flex: 1}} className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
                <SettingHeader title={'Cài đặt'}/>
                <View className="p-8 h-80 flex flex-col items-center">
                    <Pressable className="flex-row items-center" onPress={() => router.push('/(app)/notifyAndSound')}>
                        <BellIcon></BellIcon>
                        <Text className="text-white ml-4 w-72 p-4 text-xl border-b-[1px] border-b-white mb-2">Thông báo & âm thanh</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center" onPress={() => router.push('/(app)/privacyAndSecurity')}>
                        <SecurityIcon></SecurityIcon>
                        <Text className="text-white ml-4 w-72 p-4 text-xl border-b-[1px] border-b-white mb-2">Quyền riêng tư & bảo mật</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center" onPress={openModalLogout}>
                        <LogOutIcon></LogOutIcon>
                        <Text className="text-white ml-4 w-72 p-4 text-xl border-b-[1px] border-b-white mb-2">Đăng xuất</Text>
                    </Pressable>
                </View>
                {/* <View className="flex-1 items-center justify-center"> */}
                    <ModalApp isvisible={isvisible} onClose={closeModalLogout} onConfirm={logout}>
                        <View className="w-[200px] h-26">
                            <Text className="text-center text-2xl">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?</Text>
                        </View>
                    </ModalApp>
                {/* </View> */}
            </LinearGradient>
        // </View>
    )
}