import { Pressable, SafeAreaView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";
import BellIcon from '../../assets/icons/bell-notify.svg'
import SecurityIcon from '../../assets/icons/security.svg'
import LogOutIcon from '../../assets/icons/log-out.svg'
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

export default function Settings(){
    const router = useRouter();
    const {logout} = useAuth();

    return (
            <SafeAreaView className="flex-1 bg-white">
                <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
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
                        <Pressable className="flex-row items-center" onPress={() => logout()}>
                            <LogOutIcon></LogOutIcon>
                            <Text className="text-white ml-4 w-72 p-4 text-xl border-b-[1px] border-b-white mb-2">Đăng xuất</Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </SafeAreaView>
    )
}