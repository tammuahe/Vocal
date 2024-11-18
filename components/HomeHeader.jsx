import { Text, StatusBar, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common'
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';

export default function HomeHeader() { 
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { user } = useAuth()
    useEffect(() => {
        const fetchAvatar = async () => {

            const { data, error } = await supabase
                .from('profiles')
                .select('profile_picture')
                .single()

            if (error) {
                console.error('Error fetching avatar:', error.message);
                setAvatarUrl(null)
            }
            
            if (data)
            {
                setAvatarUrl(data.profile_picture);
                
            }
        };

        fetchAvatar();
    }, [user]);

        console.log('Fetched avatar URL: ', avatarUrl); // Logs the avatar URL after it is set

    return (
        <SafeAreaView className='pt-3 flex-row justify-between px-5 bg-darkblue pb-6 rounded-b-3xl shadow'>
            <StatusBar backgroundColor="#A9C6FA"/>
            <Text style={{fontSize: hp(3)}} className='font-medium text-white'>Cuộc trò chuyện</Text>

            <View>
                <Image
                    style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
                    source={avatarUrl}
                    placeholder={{ blurhash }}
                    transition={500}
                />
            </View>
        </SafeAreaView>
    )
  
}