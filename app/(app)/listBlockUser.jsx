import { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import SettingHeader from "../../components/SettingHeader";
import FriendItem from "../../components/FriendItem";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/authContext";
import {LinearGradient} from "expo-linear-gradient";

export default function ListBlockUser() {
    const {user} = useAuth();
    const [listBlockUsers, setListBlockUsers] = useState([]);

    const getListBlockUsers = async () => {
        try {
            const {data, error} = await supabase 
                .from('friends')
                .select('*')
                .eq('status', 'blocked')
                .eq('blocker_id', user.id);
            if(error) {
                console.error('Supabase error: ', error);
                setListBlockUsers([]);
            }
            if(data) {
                setListBlockUsers(data)
            }
        } catch (error) {
            console.error('Supabase error: ', error);
            setListBlockUsers([]);
        }
    }

    const handleUnBlock = async (relation_id) => {
        try {
            const {error} = await supabase
                .from('friends')
                .update({status: 'friend', blocker_id: null})
                .eq('relation_id', relation_id);
            if(error) {
                console.error('Supabase error: ', error);
            }
            await getListBlockUsers();
        } catch (error) {
            console.error('Supabase error: ', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getListBlockUsers();
        }
        if(user) {
            fetchData();
        }
    }, [user])

    return (
        <LinearGradient style={{flex: 1}} className="flex-1" colors={["#FFB9B9", "#A0C8FC"]}>
            <SettingHeader title={"Tài khoản đã chặn"}/>
            <View className="py-8 px-4">
                {listBlockUsers.length > 0 &&
                    (<View>
                    <Text className='py-4 text-2xl text-white font-bold'>Đã chặn {listBlockUsers.length} tài khoản</Text>
    
                        <FlatList 
                            data={listBlockUsers}
                            keyExtractor={(item,index) => item.relation_id}
                            renderItem={({item}) => <FriendItem 
                                                        className="mb-2" 
                                                        infor={item} 
                                                        type='blocked' 
                                                        onUnBlock={() => handleUnBlock(item.relation_id)}
                                                    />
                                        }
                        />
                            
                    </View>
                    )
                }
            </View>
        </LinearGradient>
    )
}