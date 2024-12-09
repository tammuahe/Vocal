import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import BackIcon from '../assets/icons/return-back-button-svgrepo-com.svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { useRouter } from "expo-router";


export default function SettingHeader({title}) {
    const router = useRouter();
    return(
        <SafeAreaView className='h-[60px] bg-[#F1F7FF] relative flex-row items-center'>
            <TouchableOpacity className="absolute left-4 z-10"  onPress={() => router.back()} >
                <BackIcon/>
            </TouchableOpacity>
            <Text style={{ fontSize: hp(3) }} className="text-black text-3xl font-semibold flex-1 text-center">{title}</Text>
        </SafeAreaView>
    )
}