import { SafeAreaView, View, Text,Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";
import { useState } from "react";
import RightAngleIcon from '../../assets/icons/right-angle-icon.svg';

export default function PrivacyAndSecurity() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
                <SettingHeader title={"Quyền riêng tư & bảo mật"}/>
                <View className="py-8 px-4">
                    <View className="h-[72px] bg-[#F6FCFE] rounded-3xl flex-row items-center justify-between px-8 mb-6" >
                        <Text className="text-xl font-normal">Trạng thái hoạt động</Text>
                        <Switch
                            trackColor={{false: '#ccc', true: '#65558f'}}
                            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            />
                    </View>
                    <View className="h-[72px] bg-[#F6FCFE] rounded-3xl flex-row items-center justify-between px-8 mb-6" >
                        <Text className="text-xl font-normal">Tài khoản đã chặn</Text>
                        <RightAngleIcon />
                    </View>
                    <View className="h-[72px] bg-[#F6FCFE] rounded-3xl flex-row items-center justify-between px-8 mb-6" >
                        <Text className="text-xl font-normal">Đặt lại mật khẩu</Text>
                        <RightAngleIcon />
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    ) 
}