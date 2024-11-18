import { Text, StatusBar, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common'
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import {
    Menu,
    MenuOptions,
    MenuTrigger,
  } from 'react-native-popup-menu';
import MenuItem from '@/components/MenuItem'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeHeader() { 
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { user, logout} = useAuth()
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

        const handleProfile = () => {}

        const handleLogout = async () => {
            await logout()
        }

    return (
        <SafeAreaView className='p-5 flex-row justify-between bg-darkblue pb-6 rounded-b-3xl shadow'>
            <StatusBar backgroundColor="#A9C6FA"/>
            <Text style={{fontSize: hp(3)}} className='font-medium text-white'>Cuộc trò chuyện</Text>

            <View>
                <Menu>
                    <MenuTrigger>
                        <Image
                        style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
                        source={avatarUrl}
                        placeholder={{ blurhash }}
                        transition={500}
                        />
                    </MenuTrigger>
                    <MenuOptions 
                        customStyles={{
                            optionsContainer:{
                                borderRadius: 10,
                                borderCurve: 'continuous',
                                marginTop: 40,
                                marginLeft: -20,
                                shadowOpacity: 0.2,
                                shadowOffset: {width:0, height:0},
                                width: 180,
                            }
                        }}>
                        <MenuItem 
                        text='Trang cá nhân'
                        action={handleProfile}
                        icon={<Feather name="user" size={24} color="darkblue" />}
                        />

                        <Divider />

                        <MenuItem 
                        text='Đăng xuất'
                        action={handleLogout}
                        icon={<MaterialCommunityIcons name="logout-variant" size={24} color="darkred" />}
                        />
                    </MenuOptions>
                </Menu>
                
            </View>
        </SafeAreaView>
    )
  
}

const Divider = () => {
    return(
        <View className='p-[1px] w-[75%] self-center bg-neutral-200' />
    )
}