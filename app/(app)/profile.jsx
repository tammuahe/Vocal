import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/authContext';
import { decode } from 'base64-arraybuffer';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Stack, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import MenuItem from '../../components/MenuItem'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomKeyboardView from '../../components/CustomKeyboardView'
import Entypo from '@expo/vector-icons/Entypo';
import Loading from '../../components/Loading'
import DateTimePicker from '@react-native-community/datetimepicker';


export default function profile() {
  const router = useRouter()
  const { user } = useAuth()
  const [profilePicture, setProfilePicture] = useState()
  const [path, setPath] = useState()
  const [userInfo, setUserInfo] = useState()
  const [gender, setGender] = useState(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [editBioVisible, setEditBioVisible] = useState(false)
  const [editUsernameVisible, setEditUsernameVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [birthday, setBirthday] = useState(new Date())
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const bioRef = useRef()
  const usernameRef = useRef()

  const getProfileInfo = async () => {
    try {
      console.log('getProfileInfo called');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('uuid', user.id)
        .single();
  
      if (error) {
        console.error('Supabase error:', error);
      } else {
        if (data) {
          setUserInfo(data)
          
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }); 
  };

  const unpackUserInfo = () => {
    if (userInfo){
      setGender(userInfo.gender)
      setUsername(userInfo.user_name)
      setBio(userInfo.bio)
      setBirthday(new Date(userInfo.birthday))
    }
  }

  useEffect(() => {
    console.log('profile info fetched:', userInfo);
    console.log('name info fetched:', userInfo?.user_name);
    unpackUserInfo()
  },[userInfo])

  useEffect(()=>{
    if (user?.id) {
      setPath(`${user.id}/${user.id}.jpeg`)
      setProfilePicture(`https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/${user.id}/${user.id}.jpeg`)
      getProfileInfo()
    }
  }, [user])

  const handleUpload = async () => {
    try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 0.6,
      exif: false
    })

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User cancelled image picker.')
      return
    }

    
    
    const img = result.assets[0]
    console.log('Got image', img)
    const arraybuffer = await FileSystem.readAsStringAsync(img.uri, {encoding: FileSystem.EncodingType.Base64})   
    const fileExt = 'jpeg' 
    console.log('Image object:', img.uri);
    console.log('File extension:', fileExt);
    console.log('Path:', path);

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, decode(arraybuffer), {
        contentType: img.mimeType ?? 'image/jpeg',
        upsert: true,
        metadata:{
          path: path,
          user_id: user.id
        }
      })

      if (uploadError) {
        throw uploadError
      }
      console.log('data: ', data )

    } catch (error) {
        if (error) {
          console.error(error)
        } else {
          throw error
        }
      }
      Image.clearDiskCache()
      Image.clearMemoryCache()
  }

  const handleBio = () => {
    bioRef.current = bio
    setEditBioVisible(true)
  }

  const handleUsername = () => {
    usernameRef.current = username
    setEditUsernameVisible(true)
  }

  const handleSubmitUsername = async () => {
    if (usernameRef.current.trim() !== userInfo.username){
      try {
      setLoading(true)
      console.log('handleSubmitUsername called');
      const { error } = await supabase
        .from('profiles')
        .update({user_name: usernameRef.current.trim()})
        .eq('uuid',user.id)
  
      console.log('data updated');
  
      if (error) {
        if (error.message.includes('duplicate')){
          Alert.alert('Tên người dùng', 'Tên người dùng đã có người sử dụng!')
        }
        else {
          Alert.alert('Tên người dùng', 'Có lỗi xảy ra, vui long thử lại sau.')
        }
        console.error('Supabase error:', error);
      } else {
        setUsername(usernameRef.current);
      }
      }

     catch (err) {console.error('Unexpected error:', err)} 
     finally{
      setLoading(false)
      setEditUsernameVisible(false)
    }}
    else{
      setEditUsernameVisible(false)
    }
    }

  const handleSubmitBio = async () => {
    if (bioRef.current.trim() !== userInfo.bio){
      try {
      setLoading(true)
      console.log('handleSubmitBio called');
      const { error } = await supabase
        .from('profiles')
        .update({bio: bioRef.current.trim()})
        .eq('uuid',user.id)
  
      console.log('data updated');
  
      if (error) {
        console.error('Supabase error:', error);
      } else {
        setBio(bioRef.current);
      }
      }

     catch (err) {console.error('Unexpected error:', err)} 
     finally{
      setLoading(false)
      setEditBioVisible(false)
    }}
    else{
      setEditBioVisible(false)
    }
    }
    
  // useEffect(()=>{console.log('editBioVisible: ',editBioVisible)},[editBioVisible])

  const onBirthdayChange = ({type}, selectedDate) => {
    if (type == 'set')
    {
      const currentDate = selectedDate
      setBirthday(currentDate);
      console.log(birthday)
      toggleDatepicker()
    }
    else{
      toggleDatepicker()
    }
  }

  const toggleDatepicker = () => {
    setShowBirthdayPicker(!showBirthdayPicker)
  }
  const pickBirthday = () => {toggleDatepicker()}

  const infoHasChanged = () => {
    return username != userInfo 
  }

  return (
    <CustomKeyboardView>
      <Stack.Screen 
        options={{
          title:'Trang cá nhân',
          headerStyle:{
            backgroundColor:'#F86565'
          },
          headerTintColor:'#fff',
          headerTitleStyle: { 
            fontWeight: '500'
          }
        }}
      />
      <View className='flex-1 items-center p-5'>
        {/*profile pic*/}
        <View className='p-4 mt-2'>
        <Image
          style={{height: hp(15), width:hp(15), borderRadius: 100}}
          source={{uri: profilePicture}}
          contentFit='cover'
          allowDownscaling={true}
        />
        {/*image edit button*/}
        <TouchableOpacity 
        className='absolute bottom-4 right-4'
        onPress={handleUpload}
        > 
          <Feather name="edit" size={hp(2)} color="black" />
        </ TouchableOpacity>
        </View>

        
        {(!editUsernameVisible && 
          username) &&
        (<TouchableOpacity className='flex-row items-center m-3' onPress={handleUsername}>
          <Text className='font-bold text-2xl m-3'>@{username}</Text>
        </TouchableOpacity>)
        }
        {editUsernameVisible 
        && 
        <View className='flex-row items-center p-1 ' style={{height:hp(7)}}>
          <Text className='font-bold text-2xl m-3 mr-0'>@</Text>
          <TextInput
            defaultValue={usernameRef.current}
            onChangeText={value => {
              usernameRef.current = value
            }}
            style={{ fontSize: hp(2) }}
            className="flex-row"
          />
          {loading ? 
          <Loading /> 
          : 
          <TouchableOpacity className='m-3' onPress={handleSubmitUsername}>
            <Entypo name="save" size={hp(3)} color="black" />
          </TouchableOpacity>}
        </View>}

        {!editBioVisible && (bio ? (<TouchableOpacity onPress={handleBio}><Text className='text-neutral-600 italic'>"{bio}"</Text></TouchableOpacity>)
        :
        (<TouchableOpacity onPress={handleBio}><Text className='text-neutral-600 italic'>Thêm giới thiệu</Text></TouchableOpacity>))}
        {editBioVisible 
        && 
        <View className='flex-1 border-darkblue w-[80%] p-4' style={{height:hp(10), borderStyle:'dashed', borderWidth:3, borderRadius:3}}>
          <TextInput
                    defaultValue={bioRef.current}
                    onChangeText={value => {
                      bioRef.current = value
                    }}
                    style={{ fontSize: hp(2) }}
                    className="flex-row"
                    multiline={true}
                  />
          {loading ? 
          <Loading /> 
          : 
          <TouchableOpacity className='absolute bottom-2 right-2' onPress={handleSubmitBio}>
            <Entypo name="save" size={hp(4)} color="black" />
          </TouchableOpacity>}
        </View>}
        <View 
          className='flex-1 w-[90%] m-4 items-start p-9 border-darkerblue'
          style={{
            borderStyle: 'dashed',
            borderWidth: 5,
            borderRadius: 1,
          }}>
          {}
          <View className='flex-col m-3'>
            <View className='flex-row my-10'>
              <View className='flex-row items-center'>
                <Text className='text-center'>Giới tính: </Text>
              </View>
              <Menu>
                <MenuTrigger>
                  <View className='flex-row items-center border border-neutral-600 rounded-md p-2'>
                    {gender ? <Text>{gender==='male' ? 'Nam' : 'Nữ'}</Text> : <Text>Chọn giới tính</Text>}
                    <AntDesign name="down" size={hp(2)} color="black" className='m-1'/>
                  </View>
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
                          text='Nam'
                          action={() => {setGender('male')}}
                          icon={<FontAwesome5 name="male" size={hp(3)} color="black" />}
                          />

                          <MenuItem 
                          text='Nữ'
                          action={() => {setGender('female')}}
                          icon={<FontAwesome5 name="female" size={hp(3)} color="black" />}
                          />
                      </MenuOptions>
              </Menu>
            </View>
            <View className='flex-row items-center my-10'>
                <Text>Ngày sinh: </Text> 
                <TouchableOpacity onPress={pickBirthday}>
                  
                  {showBirthdayPicker && <DateTimePicker 
                  mode='date'
                  display='default'
                  value={birthday}
                  onChange={onBirthdayChange}
                  maximumDate={new Date()}
                  />}
                  <View className='flex-row items-center border border-neutral-600 rounded-md p-2'>
                      {birthday ? <Text>{formatDate(birthday)}</Text> : <Text>Chọn ngày sinh</Text>}
                      <AntDesign name="down" size={hp(2)} color="black" className='m-1'/>
                    </View>
                </TouchableOpacity>
            </View>
          </View>

          {/*save button */}
          <View className='absolute bottom-20 left-0 right-0 mx-auto items-center'>
          <TouchableOpacity >
            <View className='border rounded p-3'>
              <Text>Lưu</Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
        {userInfo?.created_at && (<Text className='ml-auto m-3'>Gia nhập từ: {formatDate(userInfo?.created_at)}</Text>)}
      </View>
    </CustomKeyboardView>
  )
}