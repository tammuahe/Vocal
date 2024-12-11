import { SafeAreaView, View, Text,Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";
import { useState } from "react";
import RightAngleIcon from '../../assets/icons/right-angle-icon.svg';

export default function NotifyAndSound() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient className="flex-1 " colors={["#FFB9B9", "#A0C8FC"]}>
                <SettingHeader title={"Thông báo & âm thanh"}/>
                <View className="py-8 px-4">
                    <View className="h-[72px] bg-[#F6FCFE] rounded-3xl flex-row items-center justify-between px-8 mb-6" >
                        <Text className="text-xl font-normal">Không làm phiền</Text>
                        <Switch
                            trackColor={{false: '#ccc', true: '#65558f'}}
                            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            />
                    </View>
                    <View className="h-[72px] bg-[#F6FCFE] rounded-3xl flex-row items-center justify-between px-8 mb-6" >
                        <Text className="text-xl font-normal">Âm báo</Text>
                        <RightAngleIcon />
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    ) 
}