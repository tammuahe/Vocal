import React, { Component, useEffect, useRef, useState } from 'react'
import { 
    Alert,
    Button, 
    SafeAreaView, 
    Text, 
    View, 
    TextInput, 
    FlatList, 
    ScrollView, 
    Animated, 
    PanResponder, 
    Dimensions, 
    Pressable,
    TouchableOpacity, 
} from 'react-native'
import { Image } from 'expo-image';
import { useAuth } from "@/context/authContext";
import SharedLayout from '@/components/SharedLayout'
import { supabase } from '@/lib/supabase'
import {useRouter} from 'expo-router'
import FriendItem from '../../components/FriendItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BackIcon from '../../assets/icons/return-back-button-svgrepo-com-light.svg'

export default function ListFriends() {
    const router = useRouter();
    const  { logout, user } = useAuth();
    const [searchValue, setSearchValue] = useState('');
    const [listSentReq, setListSentReq] = useState([]);

    const getListSentReq = async () => {
        try {
            const {data,error} = await supabase
                .from('friends')
                .select('*')
                .eq('status', 'pending')
                .eq('sender_id', user.id);
            if(error) {
                console.error('Supabase error: ', error);
                setListSentReq([]);
            }
            setListSentReq(data);
        } catch (error) {   
            console.error('Supabase error: ', error);
                setListSentReq([]);
        }
    }

    const handleChangeSearchInput = () => {

    }

    const handleCancelSentReqest = async (relation_id) => {
        const {error} = await supabase
            .from('friends')
            .delete()
            .eq('relation_id', relation_id);
        if(error) {
            console.error('Supabase error: ', error);
        }
        getListSentReq();
    }   


    useEffect(() => {
        const fetchData = async () => {
            await getListSentReq();
        }
        if(user) {
            fetchData();
        }
    }, [user])

    return (
        <SharedLayout headerTitle="Lời mời đã gửi" className="h-screen" leftIcon={<BackIcon onPress={() => router.back()}/>}>
                <View className='flex-1'> 
                    <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Tìm kiếm '
                        value={searchValue} onChangeText={handleChangeSearchInput}
                    />
                    {listSentReq.length > 0 &&
                    (<View>
                       <Text className='py-4 text-2xl text-white font-bold'>Đã gửi {listSentReq.length} lời mời</Text>
    
                        <FlatList 
                            data={listSentReq}
                            keyExtractor={(item,index) => item.relation_id}
                            renderItem={({item}) => <FriendItem 
                                                        className="mb-2" 
                                                        infor={item} 
                                                        type='sent_request' 
                                                        onCancelSentReq={() => handleCancelSentReqest(item.relation_id)}
                                                    />
                                        }
                        />
                            
                    </View>
                    )
                }
                    
                </View>
        </SharedLayout>
    )

}