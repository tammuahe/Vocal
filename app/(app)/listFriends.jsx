import React, { Component, useEffect, useState } from 'react'
import { Alert, Button, SafeAreaView, Text, View, TextInput, FlatList } from 'react-native'
import { useAuth } from "@/context/authContext";
import SharedLayout from '@/components/SharedLayout'
import UserAddIcon from '../../assets/icons/user-add-svgrepo-com.svg'
import { supabase } from '@/lib/supabase'
import {useRouter} from 'expo-router'
import FriendItem from '../../components/FriendItem';


export default function ListFriends() {
    const router = useRouter();
    const  { logout, user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const getListFriends = async () => {
        try {
            const {data, error} = await supabase
            .from('friends')
            .select('*').eq('status', 'friend')
            if(error) {
                console.error('Supabase error: ', error);
            }else {
                setFriends(data);
            }
        }catch(err) {
            console.error('Unexpected error:', err);
        }
    }

    useEffect(()=>{
        const fetchData = async () => {
            await getListFriends();
        }
        if(user) {
            fetchData();
        }
    }, [user])

    const navigateToAddFriendScreen = () => {
        router.push('/(app)/addFriend')
    }


    const searchFriendByUsername = async (user_name) => {
        if (user_name !== '') {
            const { data, error } = await supabase
                .from('profiles')
                .select('uuid')
                .like('user_name', `%${user_name}%`); 
            
            if (data) {
                const searchFriends = data
                .filter(item => item.uuid != user.id)
                .map(item => ({
                    smaller_id: item.uuid
                }));
                setFriends(searchFriends);
            } else {
                console.error('Supabase error: ', error);
            }
        } else {
            await getListFriends(); 
        }
    };

    const handleChangeSearchInput = async (value) => {
        setSearchValue(value);
        await searchFriendByUsername(value); 
    };

    return (
        <SharedLayout headerTitle="Bạn bè" leftIcon={<UserAddIcon onPress={navigateToAddFriendScreen}/>}>
            <View>
                <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Tìm bạn bè'
                    value={searchValue} onChangeText={handleChangeSearchInput}
                />
                {searchValue == '' && 
                    <View className='py-4'>
                        <Text className='text-white text-3xl font-bold'>{friends?.length} bạn bè</Text>
                    </View>
                }
                <View className='py-4'>
                    <FlatList 
                        data={friends}
                        keyExtractor={item => item.relation_id}
                        renderItem={({item}) => <FriendItem className="mb-2" infor={item}/>}
                    />
                    
                </View>

                <Text>hleoeo</Text>
            </View>
        </SharedLayout>
    )

}