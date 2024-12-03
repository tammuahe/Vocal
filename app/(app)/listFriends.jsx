import React, { Component, useEffect, useState } from 'react'
import { Alert, Button, SafeAreaView, Text, View, TextInput } from 'react-native'
import { useAuth } from "@/context/authContext";
import SharedLayout from '@/components/SharedLayout'
import UserAddIcon from '../../assets/icons/user-add-svgrepo-com.svg'
import { supabase } from '@/lib/supabase'

export default function ListFriends() {
    const  { logout, user } = useAuth();
    const [friends, setFriends] = useState([])
    const getListFriends = async () => {
        try {
            const {data, error} = await supabase
            .from('friends')
            .select('*')
            .eq('relation_id', user.id);
            if(error) {
                console.error('Supabase error: ', error);
            }else {
                console.log(data);
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

    return (
        <SharedLayout headerTitle="Friends" leftIcon={<UserAddIcon />}>
            <View>
                <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Search'/>
            </View>
        </SharedLayout>
    )

}