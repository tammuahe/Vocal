import { View, Text, TextInput, FlatList } from "react-native";
import SharedLayout from "@/components/SharedLayout";
import ReturnBackIcon from "../../assets/icons/return-back-button-svgrepo-com-light.svg";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import FriendItem from "../../components/FriendItem";

export default function AddFriend() {
    const router = useRouter();
    const  { user } = useAuth();
    const [friendInvitations, setFriendInvitations] = useState([]);
    const [strangers, setStrangers] = useState([]);

    const getListFriendInvitations = async () => {
        const {data, error} = await supabase
                                .from('friends')
                                .select('*')
                                .eq('status', 'pending')
                                .neq('sender_id', user.id);
        if(error){
            console.error('Supabase error: ', error);
        }else {
            setFriendInvitations(data)
        }
    }

    const getListStrangers = async () => {
        try {
            const { data, error } = await supabase
              .rpc('get_strangers', { current_user_id: user.id });
        
            if (error) {
              console.error('Error fetching strangers:', error);
              setStrangers([]);
            }
        
            setStrangers(data);
        } catch (err) {
            console.error('Error:', err);
            setStrangers([]);
        }
    }

  const acceptInvitatinon = async (relation_id) => {
    console.log(relation_id);
    if (relation_id) {
      const { error } = await supabase
        .from("friends")
        .update({ status: "friend" })
        .eq("relation_id", relation_id);
      if (error) {
        console.error("Supabase error: ", error);
      } else {
        await getListFriendInvitations();
      }
    } else {
      console.error("no relation_id");
    }

    const handleSendFriendReq = async (friend_id) => {
        const req = {
            smaller_id: friend_id < user.id ? friend_id : user.id, 
            bigger_id: friend_id < user.id ? user.id : friend_id, 
            sender_id: user.id, 
            status: 'pending'
        }
        const {error} = await supabase
            .from('friends')
            .insert([{...req}]);
        if(error) {
            console.error("Supabase error: ", error);
            return;
        }
        getListStrangers();
    }

    useEffect(() => {
        const fetchData = async () => {
            await getListFriendInvitations();
        }
        const fetchStrangerData = async () => {
            await getListStrangers();
        }
        if(user) {
            fetchData();
            fetchStrangerData();
        }
    }, [user])

    return (
        <SharedLayout headerTitle="Bạn bè" leftIcon={<ReturnBackIcon onPress={() => router.push('/(app)/listFriends')}/>}>
            
            <View className='flex-1'>
                <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Tìm kiếm'/>
                {friendInvitations.length > 0 &&
                    (<View>
                       <Text className='py-4 text-2xl text-white font-bold'>{friendInvitations.length} lời mời kết bạn mới</Text>
    
                        <FlatList 
                            data={friendInvitations}
                            keyExtractor={(item,index) => item.smaller_id}
                            renderItem={({item}) => <FriendItem 
                                                        className="mb-2" 
                                                        infor={item} 
                                                        type='pending_friend' 
                                                        onAcceptFriend={() => acceptInvitatinon(item.relation_id)}
                                                    />
                                        }
                        />
                            
                    </View>
                    )
                }
                {strangers.length > 0 &&
                    (<View>
                       <Text className='py-4 text-2xl text-white font-bold'>Những người bạn có thể biết</Text>
    
                        <FlatList 
                            data={strangers}
                            keyExtractor={(item,index) => item.uuid}
                            renderItem={({item}) => <FriendItem 
                                                        className="mb-2" 
                                                        infor={{...item, smaller_id: item.uuid}} 
                                                        type='stranger' 
                                                        onSendFriendReq={() => handleSendFriendReq(item.uuid)}
                                                    />
                                        }
                        />
                            
                    </View>
                    )
                }
            </View>
        </SharedLayout>
    )
}}
