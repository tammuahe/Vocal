import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingHeader from "../../components/SettingHeader";

export default function PrivacyAndSecurity() {

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
                <SettingHeader title={"Quyền riêng tư & bảo mật"}/>
                
            </LinearGradient>
        </SafeAreaView>
    ) 
}