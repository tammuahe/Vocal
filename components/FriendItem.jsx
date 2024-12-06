import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import DotMenuIcon from '../assets/icons/dot-menu-more-2-svgrepo-com.svg'
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase'



export default function FriendItem({infor, onMoreActionPress, ...res}) {
    const {user} = useAuth();
    const [friend, setFriend] = useState({});

    const getInforFriend = async (friend_id) => {
        const {data, error} = await supabase.
        from('profiles').select('*').eq('uuid',friend_id);
        // console.log(data);
        if(data) {
            setFriend(data[0]);
        }else {
            console.error('Supabase error: ',error);
        }
    }
    
    useEffect(()=>{
        const friend_id = infor.smaller_id != user.id ? infor.smaller_id : infor.bigger_id;
        if(friend_id) {
            const fetchData = async () => {
                await getInforFriend(friend_id);
            }
            fetchData();
        }else {
            console.error('no friend_id')
        }
    }, [user])

    const handleMoreActionPress = () => {
        onMoreActionPress({friend: friend, infor: infor})
    }

    return (
        <View {...res}>
            <View className="bg-white w-full h-[60px] rounded-xl px-2 flex-row items-center" >
                <Image 
                    source={''} 
                    style={{height: hp(5), width: hp(5), borderRadius: 100}}
                    contentFit='contain'
                    placeholder={require('../assets/images/default_avatar.png')}
                />
                <View className="ml-1">
                    <Text className="text-lg font-semibold"> {friend.user_name}</Text>
                    {/* <Text className="text-[#A9A9A9]"> {infor.matualFriend} bạn chung</Text> */}
                </View>
                <TouchableOpacity className="ml-auto mr-1" onPress={handleMoreActionPress}>
                    <DotMenuIcon/>
                </TouchableOpacity>
            </View>
        </View>
    )
}