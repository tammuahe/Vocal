import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import DotMenuIcon from '../assets/icons/dot-menu-more-2-svgrepo-com.svg'

export default function FriendItem({infor ,...res}) {
    return (
        <View {...res}>
        <View className="bg-white w-full h-[60px] rounded-xl px-2 flex-row items-center" >
            <Image 
                source={''} 
                style={{height: hp(5), width: hp(5), borderRadius: 100}}
                contentFit='contain'
                placeholder={require('../assets/images/default-conversation.png')}
            />
            <View className="ml-1">
                <Text className="text-lg font-semibold"> {infor.userName}</Text>
                <Text className="text-[#A9A9A9]"> {infor.matualFriend} bạn chung</Text>
            </View>
            <TouchableOpacity className="ml-auto mr-1">
                <DotMenuIcon/>
            </TouchableOpacity>
        </View>
        </View>
    )
}