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
import UserAddIcon from '../../assets/icons/user-add-svgrepo-com.svg'
import { supabase } from '@/lib/supabase'
import {useRouter} from 'expo-router'
import FriendItem from '../../components/FriendItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MessageIcon from '../../assets/icons/message-circle-dots-svgrepo-com.svg'
import UnfriendIcon from '../../assets/icons/unfriend-svgrepo-com.svg'
import BlockIcon from '../../assets/icons/block-1-svgrepo-com.svg'

const { height } = Dimensions.get("window"); // Lấy chiều cao màn hình


export default function ListFriends() {
    const router = useRouter();
    const  { logout, user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [infoFriend, setInforFriend] = useState({});
    const [friend, setFriend] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [isShowNavBottom, setIsShowNavBottom] = useState(true);
    const translateY = useRef(new Animated.Value(400)).current;
    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: (evt, gestureState) => {
            // Giới hạn kéo xuống không quá 300
            const newTranslateY = Math.max(0, gestureState.dy);
            translateY.setValue(newTranslateY);
          },
          onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 150) {
              // Nếu kéo quá 150px thì biến mất
              Animated.parallel([
                Animated.timing(translateY, {
                  toValue: height, // Di chuyển xuống ngoài màn hình
                  duration: 100,
                  useNativeDriver: true,
                }),
              ]).start(() => setIsShowNavBottom(true)); // Ẩn sau khi animation kết thúc
            } else {
              // Nếu kéo không đủ xa thì quay về vị trí ban đầu
              Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0, 
                    duration: 100, 
                    useNativeDriver: true,
                  }),
              ]).start();
            }
          },
        })
      ).current;

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

    const handlePressFriendMoreAction = (data) => {
        if(data != null) {
            setFriend(data.friend);
            setInforFriend(data.infor);
        }
        setIsShowNavBottom(!isShowNavBottom)
        if(!isShowNavBottom) {
            Animated.timing(translateY, {
                toValue: 400, 
                duration: 200, 
                useNativeDriver: true,
                }).start();
        }else {
            Animated.timing(translateY, {
                toValue: 0, 
                duration: 200, 
                useNativeDriver: true,
                }).start();
        }
    }

    const converDateToString = (dateStr) => {
        const date = new Date(dateStr);

        const month = date.getMonth() + 1; 
        const year = date.getFullYear();

        const formattedDate = `tháng ${month} năm ${year}`;
        return formattedDate;
    }

    const openInbox = (conversationId, listParticipantId) => {
        router.push({
            pathname: '/inbox', 
            params: {
                conversation_id: conversationId,
                participants_id: listParticipantId
            } 
        })
      }

    const createConversation = async (friend) =>{ 
        let commonConversations = null
        const { data: checkData, error: checkError } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .in('participant_id', [user.id, friend.uuid]);

        if (checkError) {
            console.error('Error:', checkError);
        } else {
            const conversationCounts = checkData.reduce((acc, row) => {
                acc[row.conversation_id] = (acc[row.conversation_id] || 0) + 1;
                return acc;
            }, {});

            commonConversations = Object.keys(conversationCounts).filter(
                (key) => conversationCounts[key] === 2
            )[0];
        }
        
        if(commonConversations) {
            openInbox(commonConversations, [user.id, friend.uuid]);
        }else {
            const { data: insertData, error} = await supabase
                .from('conversations')
                .insert([{}]).select();
            if(error) {
                console.error('Supabase error: ', error);
            }
            if(insertData) {
                const conversationId = insertData[0]?.id
                const {error: c_error } = await supabase
                .from('conversation_participants')
                .insert([
                    {participant_id: user.id, conversation_id: conversationId, is_creator: true},
                    {participant_id: friend.uuid, conversation_id: conversationId, is_creator: false}
                ])
                if(c_error) {
                    console.error('Supabase error: ', c_error);
                }else {
                    openInbox(conversationId, [user.id, friend.uuid]);
                }
            }
        }
    }

    const handleUnfriend = async (infoFriend) => {
        const {error} = await supabase
            .from('friends')
            .delete()
            .eq('relation_id', infoFriend.relation_id);
        if(error) {
            console.error('Supabase error: ', error);
        }else {
            await getListFriends();
            handlePressFriendMoreAction(null);
        }

    }

    return (
        <SharedLayout headerTitle="Bạn bè" className="h-screen" leftIcon={<UserAddIcon onPress={navigateToAddFriendScreen}/>} showNavBottom={isShowNavBottom} >
                <View className='flex-1'> 
                    <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Tìm kiếm bạn bè'
                        value={searchValue} onChangeText={handleChangeSearchInput}
                    />
                    {searchValue == '' && 
                        <View className='py-4'>
                            <Text className='text-white text-3xl font-bold'>{friends?.length} bạn bè</Text>
                        </View>
                    }
                    <View className='pb-4'>
                        <FlatList 
                            data={friends}
                            keyExtractor={(item,index) => item.smaller_id}
                            renderItem={({item}) => <FriendItem className="mb-2" infor={item} onMoreActionPress={(data) => handlePressFriendMoreAction(data)}/>}
                        />
                        
                    </View>
    
                </View>
                {!isShowNavBottom && 
                    <Pressable onPress={() => handlePressFriendMoreAction(null)} className='absolute bottom-0 left-0 right-0 z-40 w-screen h-screen bg-black opacity-30'>
                    </Pressable>
                }
                <Animated.View 
                    style={[{ transform: [{ translateY }] }]} 
                    className='w-screen h-80 bg-[#97D7FF] absolute bottom-0 left-0 z-50 rounded-s-[16px]'
                    {...panResponder.panHandlers}
                >
                    <View className='flex-row justify-center items-center py-4'>
                        <View className='bg-white w-16 h-[6px] rounded-full'></View>
                    </View>
                    <View className='flex-row px-6 pb-2'>
                        <Image 
                            source={''} 
                            style={{height: hp(8), width: hp(8), borderRadius: 100}}
                            contentFit='contain'
                            placeholder={require('../../assets/images/default_avatar.png')}
                        />
                        <View className='flex-col items-start ml-2'>
                            <Text className='text-white font-bold text-2xl'>{friend?.user_name}</Text>
                            <Text className='text-white mt-1'>Bạn bè từ {converDateToString(infoFriend?.add_at)}</Text>
                        </View>
                    </View>
                    <View className='w-full h-[1px] bg-white'></View>
                    <View className='flex-col items-left py-4 px-6'>
                        <TouchableOpacity className='flex-row items-center mb-4' onPress={() => createConversation(friend)}>
                            <MessageIcon />
                            <Text className='ml-2 text-xl text-white'>Nhắn tin cho {friend?.user_name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-row items-center mb-4' onPress={() => handleUnfriend(infoFriend)}>
                            <UnfriendIcon />
                            <Text className='ml-2 text-xl text-white'>Hủy kết bạn với {friend?.user_name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-row items-center mb-4'>
                            <BlockIcon />
                            <Text className='ml-2 text-xl text-white'>Chặn {friend?.user_name}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
        </SharedLayout>
    )

}