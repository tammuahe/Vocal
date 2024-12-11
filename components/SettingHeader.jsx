import { Pressable, Text, TouchableOpacity, View } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import BackIcon from '../assets/icons/return-back-button-svgrepo-com.svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { useRouter } from "expo-router";


export default function SettingHeader({title}) {
    const router = useRouter();
    return(
        <SafeAreaView  className='bg-[#F1F7FF] flex-row justify-between items-end pb-4'>
            <TouchableOpacity className="size-10 left-4 z-20"  onPress={() => router.back()} >
                <BackIcon/>
            </TouchableOpacity>
            <Text style={{ fontSize: hp(3) }} className="text-black text-3xl font-semibold flex-1 text-center">{title}</Text>
            <View className="size-10"></View>
        </SafeAreaView>
    )
}