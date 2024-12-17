import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SafeAreaView, Text, TouchableOpacity, View, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "@/components/Loading.jsx";
import ChatList from "@/components/ChatList";
import { supabase } from "@/lib/supabase";
import SharedLayout from "@/components/SharedLayout";
import CreateChatIcon from "@/assets/icons/create-note-svgrepo-com.svg";
import {
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import FriendItem from "@/components/FriendItem";
import CreateChatUserList from "@/components/CreateChatUserList";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export default function Home() {
  const [chats, setChats] = useState([]);
  const sheetRef = useRef(null);
  const { user } = useAuth();
  const [friends, setFriends] = useState({});
  const conversationName = useRef("");
  const [newChatParticipantList, setNewChatParticipantList] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(
      undefined
    );
    const notificationListener = useRef();
    const responseListener = useRef();
  

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    console.error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Vui lòng cấp quyền để hiển thị thông báo!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Không tìm thấy ID project');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Vui lòng sử dụng thiết bị vật lí.');
    }
  }

  useEffect(() => {
      registerForPushNotificationsAsync()
        .then(token => setExpoPushToken(token ?? ''))
        .catch((error) => setExpoPushToken(`${error}`));
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current &&
          Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversationStream')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `participant_id=eq.${user?.id}`,
        },
        (payload) => {
          const { conversation_id } = payload.new;
          setChats((prevChats) => [
            ...prevChats,
            { conversation_id },
          ]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const removeParticipant = (id) => {
    setNewChatParticipantList(
      newChatParticipantList.filter((value) => {
        return value !== id;
      })
    );
  };
  const addParticipant = (id) => {
    setNewChatParticipantList((prevList) => {
      if (!prevList.includes(id)) {
        return [...prevList, id];
      }
      return prevList;
    });
  };

  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const getListFriends = async () => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("status", "friend");
      if (error) {
        console.error("Supabase error: ", error);
      } else {
        setFriends(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("participant_id", user.id);
      if (error) {
        console.error("Supabase error:", error);
      } else {
        setChats(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const fetchData = async () => {
    getConversations();
    getListFriends();
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const openBottomSheet = () => {
    handleSnapPress(2);
  };
  const renderBackdrop = (props) => {
    return <BottomSheetBackdrop {...props} />;
  };

  const customHandle = () => {
    return (
      <View className="flex-row border-b-2 border-white p-4">
        <TouchableOpacity onPress={handleClosePress}>
          <View className="flex-1 p-2">
            <Text
              className="font-inter text-[#A9A9A9]"
              style={{ fontSize: hp(2) }}
            >
              Huỷ
            </Text>
          </View>
        </TouchableOpacity>
        <View className="flex-1 p-2">
          <Text
            className="text-center font-inter font-bold text-white"
            style={{ fontSize: hp(2.5) }}
          >
            Nhóm mới
          </Text>
        </View>
        {(newChatParticipantList.length > 1 && user) && (
          <TouchableOpacity onPress={createConversation}>
            <View className="flex-1 p-2 ">
              <Text
                className="text-right font-inter text-white"
                style={{ fontSize: hp(2) }}
              >
                Tạo
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const createConversation = async () => {
    const insertParticipants = async (conversationID) => {
      const insertList = newChatParticipantList.filter(
        (item) => item != user.id
      );
      try {
        const { error } = await supabase
          .from("conversation_participants")
          .insert([
            ...insertList.map((item) => ({
              participant_id: item,
              conversation_id: conversationID,
              is_creator: false
            })),
            {
              participant_id: user.id,
              conversation_id: conversationID,
              is_creator: true,
            },
          ]);
        if (error) {
          console.error("Supabase error: ", error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ conversation_name: conversationName.current.trim() })
        .select()
        .single();
      if (error) {
        console.error("Supabase error: ", error);
      } else {
        insertParticipants(data.id);
        setNewChatParticipantList([]);
        handleClosePress();
        fetchData();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SharedLayout
        headerTitle="Cuộc trò chuyện"
        leftIcon={
          <TouchableOpacity onPress={openBottomSheet}>
            <CreateChatIcon width={32} height={32} fill="#fff" />
          </TouchableOpacity>
        }
      >
        <View className="flex-1">
          {chats.length > 0 ? (
            <ChatList users={chats} />
          ) : (
            <View className="flex items-center" style={{ top: hp(30) }}>
              <Text classname='text-lightgrey'>Bạn chưa tham gia cuộc trò chuyện nào :&lt; </Text>
            </View>
          )}
        </View>
      </SharedLayout>
      <BottomSheet
        backgroundStyle={{ backgroundColor: "#97D7FF" }}
        handleIndicatorStyle={{ backgroundColor: "white", width: wp(15) }}
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        handleComponent={customHandle}
        backdropComponent={renderBackdrop}
      >
        <View className="p-0 my-5 mx-10">
          <TextInput
            onChangeText={(value) => {
              conversationName.current = value;
            }}
            style={{
              borderLeftWidth: 1,
              paddingLeft: 10,
              borderLeftColor: "white",
            }}
            placeholder="Tên nhóm"
            placeholderTextColor={"#A9A9A9"}
          />
        </View>

        {newChatParticipantList.length>0 && (
          <CreateChatUserList
            participantId={newChatParticipantList}
            onRemoveParticipant={removeParticipant}
          />
        )}
        <BottomSheetFlashList
          estimatedItemSize={80}
          data={friends}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  addParticipant(
                    item.bigger_id == user?.id
                      ? item.smaller_id
                      : item.bigger_id
                  );
                }}
              >
                <FriendItem
                  className="my-2 mx-12"
                  infor={item}
                  showMoreActionsIcon={false}
                />
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}
