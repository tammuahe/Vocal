import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import DotMenuIcon from '../assets/icons/dot-menu-more-2-svgrepo-com.svg'
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase'



export default function FriendItem({infor, type = 'friend', onMoreActionPress, onAcceptFriend, onSendFriendReq, onCancelSentReq, onUnBlock, ...res}) {
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


    const timeAgo = (time) => {
        const timestamp = new Date(time).getTime();
        const now = Date.now(); 
        const diff = now - timestamp; 
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60); 
        const hours = Math.floor(minutes / 60); 
        const days = Math.floor(hours / 24); 
        const months = Math.floor(days / 30); 
        const years = Math.floor(months / 12);
    
        if (seconds < 60) {
            return `${seconds} giây trước`;
        } else if (minutes < 60) {
            return `${minutes} phút trước`;
        } else if (hours < 24) {
            return `${hours} giờ trước`;
        } else if (days < 30) {
            return `${days} ngày trước`;
        } else if (months < 12) {
            return `${months} tháng trước`;
        } else {
            return `${years} năm trước`;
        }
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
                    {type == 'pending_friend' || type == 'sent_request' &&
                        <Text className="text-[#949393]"> {timeAgo(infor.sent_at)}</Text>
                    }
                </View>
                {type == 'friend' && 
                    <TouchableOpacity className="ml-auto mr-1" onPress={handleMoreActionPress}>
                        <DotMenuIcon/>
                    </TouchableOpacity>
                }
                {type == 'stranger' && 
                    <TouchableOpacity className="ml-auto mr-1" onPress={onSendFriendReq}>
                        <Text className="text-[#00AAFF]">Kết bạn</Text>
                    </TouchableOpacity>
                }
                {type == 'pending_friend' && 
                    <TouchableOpacity className="ml-auto mr-1" onPress={onAcceptFriend}>
                        <Text className="text-[#00AAFF]">Chấp nhận</Text>
                    </TouchableOpacity>
                }
                {type == 'sent_request' && 
                    <TouchableOpacity className="ml-auto mr-1" onPress={onCancelSentReq}>
                        <Text className="text-[#ccc]">Hủy</Text>
                    </TouchableOpacity>
                }
                {type == 'blocked' && 
                    <TouchableOpacity className="ml-auto mr-1" onPress={onUnBlock}>
                        <Text className="text-[#00AAFF]">Bỏ chặn</Text>
                    </TouchableOpacity>
                }
                
            </View>
        </View>
    )
}