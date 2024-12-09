import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";

export default function NotifyAndSound() {

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
                <SettingHeader title={"Thông báo & âm thanh"}/>
                
            </LinearGradient>
        </SafeAreaView>
    ) 
}