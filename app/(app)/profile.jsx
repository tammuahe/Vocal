import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/authContext";
import { decode } from "base64-arraybuffer";
import { Image } from "expo-image";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Stack, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuItem from "../../components/MenuItem";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import Entypo from "@expo/vector-icons/Entypo";
import Loading from "../../components/Loading";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import BackIcon from "../../assets/icons/return-back-button-svgrepo-com";
import InputField from "../../components/Inputfield";
export default function profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState();
  const [path, setPath] = useState();
  const [userInfo, setUserInfo] = useState();
  const [gender, setGender] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [editBioVisible, setEditBioVisible] = useState(false);
  const [editUsernameVisible, setEditUsernameVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  //const [phone, setPhone] = useState();
  const [infoHasChanged, setInfoHasChanged] = useState(false)
  const bioRef = useRef("");
  const usernameRef = useRef("");
  const phoneRef = useRef("");

  const getProfileInfo = async () => {
    try {
      //console.log("getProfileInfo called");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("uuid", user.id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
      } else {
        if (data) {
          setUserInfo(data);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const unpackUserInfo = () => {
    if (userInfo) {
      setGender(userInfo.gender);
      setUsername(userInfo.user_name);
      setBio(userInfo.bio);
      setBirthday(new Date(userInfo.birthday));
      //setPhone(userInfo.phone);
      phoneRef.current = userInfo.phone;
    }
  };

  useEffect(() => {
    //console.log("profile info fetched:", userInfo);
    unpackUserInfo();
  }, [userInfo]);

  useEffect(() => {
    if (user?.id) {
      setPath(`${user.id}/${user.id}.jpeg`);
      setProfilePicture(
        `https://svhpgiuamrfudkosbijk.supabase.co/storage/v1/object/public/avatars/${user.id}/${user.id}.jpeg`
      );
      getProfileInfo();
    }
  }, [user]);

  const handleUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 0.6,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const img = result.assets[0];
      console.log("Got image", img);
      const arraybuffer = await FileSystem.readAsStringAsync(img.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileExt = "jpeg";
      console.log("Image object:", img.uri);
      console.log("File extension:", fileExt);
      console.log("Path:", path);

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, decode(arraybuffer), {
          contentType: img.mimeType ?? "image/jpeg",
          upsert: true,
          metadata: {
            path: path,
            user_id: user.id,
          },
        });

      if (uploadError) {
        throw uploadError;
      }
      console.log("data: ", data);
    } catch (error) {
      if (error) {
        console.error(error);
      } else {
        throw error;
      }
    }
    Image.clearDiskCache();
    Image.clearMemoryCache();
  };

  const handleBio = () => {
    bioRef.current = bio;
    setEditBioVisible(true);
  };

  const handleUsername = () => {
    usernameRef.current = username;
    setEditUsernameVisible(true);
  };

  const handleSubmitUsername = async () => {
    if (usernameRef.current.trim() !== userInfo.username) {
      try {
        setLoading(true);
        console.log("handleSubmitUsername called");
        const { error } = await supabase
          .from("profiles")
          .update({ user_name: usernameRef.current.trim() })
          .eq("uuid", user.id);

        console.log("data updated");

        if (error) {
          if (error.message.includes("duplicate")) {
            Alert.alert(
              "Tên người dùng",
              "Tên người dùng đã có người sử dụng!"
            );
          } else {
            Alert.alert(
              "Tên người dùng",
              "Có lỗi xảy ra, vui long thử lại sau."
            );
          }
          console.error("Supabase error:", error);
        } else {
          setUsername(usernameRef.current);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
        setEditUsernameVisible(false);
      }
    } else {
      setEditUsernameVisible(false);
    }
  };

  const handleSubmitBio = async () => {
    if (bioRef.current.trim() !== userInfo.bio) {
      try {
        setLoading(true);
        console.log("handleSubmitBio called");
        const { error } = await supabase
          .from("profiles")
          .update({ bio: bioRef.current.trim() })
          .eq("uuid", user.id);

        console.log("data updated");

        if (error) {
          console.error("Supabase error:", error);
        } else {
          setBio(bioRef.current);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
        setEditBioVisible(false);
      }
    } else {
      setEditBioVisible(false);
    }
  };

  const checkinfoHasChanged = () => {
    setInfoHasChanged(
      phoneRef?.current.trim() != userInfo.phone ||
      birthday.toISOString().split("T")[0] != userInfo.birthday ||
      gender != userInfo.gender
    );
  };

  const handleSaveChanges = async () => {
    console.log(phoneRef.current);
    console.log(birthday);
    console.log(gender);
    try {
      setLoading(true);
      if (infoHasChanged) {
        console.log("handleSubmitBio called");
        const { error } = await supabase
          .from("profiles")
          .update({
            gender: gender,
            birthday: birthday.toISOString().split("T")[0],
            phone: phoneRef.current.trim(),
          })
          .eq("uuid", user.id);

        console.log("data updated");
        if (error) {
          console.error("Supabase error:", error);
        } else {
          setBio(bioRef.current);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
      router.back()
    }
  };

  // useEffect(()=>{console.log('editBioVisible: ',editBioVisible)},[editBioVisible])

  const onBirthdayChange = ({ type }, selectedDate) => {
    if (type == "set") {
      setBirthday(selectedDate);
      setShowBirthdayPicker(false);
      checkinfoHasChanged()
    } else {
      setShowBirthdayPicker(false);
    }
  };

  useEffect(() => {
    if (birthday) {
      console.log(
        "birthday usestate: ",
        birthday.toISOString().split("T")[0],
        "fetched birthday: ",
        userInfo?.birthday
      );
    }
  }, [userInfo, birthday]);

  const toggleDatePicker = () => {
    setShowBirthdayPicker(true);
  };
  const handleBack = () => {
    router.back();
  };
  return (
    <CustomKeyboardView>
      <LinearGradient className="flex-1" style={{flex: 1}} colors={["#FFB9B9", "#A0C8FC"]}>
        <Stack.Screen
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#F1F7FF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "500",
            },
            headerLeft: () => (
              <BackIcon
                width={40}
                height={40}
                onPress={handleBack}
              />
            ),
          }}
        />
        <StatusBar style="dark" animated={true} />
        <View className="flex-1 items-center p-5">
          {/*profile pic*/}
          <View className="p-4 mt-2">
            <Image
              style={{ height: hp(15), width: hp(15), borderRadius: 100 }}
              source={{ uri: profilePicture }}
              contentFit="cover"
              allowDownscaling={true}
              placeholder={require("@/assets/images/default_avatar.png") }
            />
            {/*image edit button*/}
            <TouchableOpacity
              className="absolute bottom-3.5 right-3.5"
              onPress={handleUpload}
            >
              <Feather name="edit" size={hp(2)} color="white" />
            </TouchableOpacity>
          </View>

          {!editUsernameVisible && username && (
            <TouchableOpacity
              className="flex-row items-center m-3"
              onPress={handleUsername}
            >
              <Text className="font-bold font-inter text-2xl m-2 text-white">
                @{username}
              </Text>
            </TouchableOpacity>
          )}
          {editUsernameVisible && (
            <View
              className="flex-row items-center p-1 "
              style={{ height: hp(7) }}
            >
              <Text className="font-bold text-2xl m-3 text-white mr-0">@</Text>
              <TextInput
                defaultValue={usernameRef.current}
                onChangeText={(value) => {
                  usernameRef.current = value;
                }}
                style={{ fontSize: hp(2) }}
                className="flex-row"
              />
              {loading ? (
                <Loading />
              ) : (
                <TouchableOpacity
                  className="m-3"
                  onPress={handleSubmitUsername}
                >
                  <Entypo name="save" size={hp(3)} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {!editBioVisible &&
            (bio ? (
              <TouchableOpacity onPress={handleBio}>
                <Text className="text-neutral-600 font-bold text-2xl m-3">
                  "{bio}"
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleBio}>
                <Text className="text-neutral italic">Thêm giới thiệu</Text>
              </TouchableOpacity>
            ))}
          {editBioVisible && (
            <View
              className="flex-1 border-darkblue w-[80%] p-4"
              style={{
                height: hp(10),
                borderStyle: "dashed",
                borderWidth: 3,
                borderRadius: 3,
              }}
            >
              <TextInput
                defaultValue={bioRef.current}
                onChangeText={(value) => {
                  bioRef.current = value;
                }}
                style={{ fontSize: hp(2) }}
                className="flex-row"
                multiline={true}
              />
              {loading ? (
                <Loading />
              ) : (
                <TouchableOpacity
                  className="absolute bottom-2 right-2"
                  onPress={handleSubmitBio}
                >
                  <Entypo name="save" size={hp(4)} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View className="w-[90%] h-[55%]">
            <View className="flex-row items-center">
              <View
                className="flex-1 bg-lightgrey rounded-3xl my-4"
                style={{ height: hp(8) }}
              >
                <View className="pl-3">
                  <Text className="pl-5 pt-3 font-inter font-bold text-lg">
                    Số điện thoại
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={(value) => {
                      phoneRef.current = value;
                      checkinfoHasChanged()
                      console.log(phoneRef.current);
                    }}
                    className="ml-5 p-0"
                    placeholder={
                      phoneRef?.current
                        ? phoneRef?.current
                        : "Nhập số điện thoại"
                    }
                    defaultValue={phoneRef?.current ? phoneRef?.current : ""}
                  />
                </View>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-1 bg-lightgrey rounded-3xl my-4"
                style={{ height: hp(8) }}
                onPress={toggleDatePicker}
              >
                <View className="pl-3">
                  <Text className="pl-5 pt-3 font-inter font-bold text-lg">
                    Ngày sinh
                  </Text>
                  <TextInput
                    className="ml-5 p-0"
                    placeholder={birthday && formatDate(birthday)}
                    editable={false}
                  />
                  {showBirthdayPicker && (
                    <DateTimePicker
                      mode="date"
                      value={birthday}
                      onChange={onBirthdayChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-1 items-center">
              <Menu>
                <MenuTrigger
                  customStyles={{
                    triggerWrapper: { width: wp(81) },
                  }}
                >
                  <View
                    className=" bg-lightgrey rounded-3xl my-4"
                    style={{ height: hp(8) }}
                  >
                    <View className="pl-3 flex-1">
                      <Text className="pl-5 pt-3 font-inter font-bold text-lg">
                        Giới tính
                      </Text>
                      <TextInput
                        className="ml-5 p-0"
                        placeholder={gender == "male" ? "Nam" : "Nữ"}
                        editable={false}
                      />
                    </View>
                  </View>
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      borderRadius: 10,
                      borderCurve: "continuous",
                      marginTop: 40,
                      marginLeft: -20,
                      shadowOpacity: 0.2,
                      shadowOffset: { width: 0, height: 0 },
                      width: 180,
                    },
                  }}
                >
                  <MenuItem
                    text="Nam"
                    action={() => {
                      setGender("male");
                      checkinfoHasChanged()
                    }}
                    icon={
                      <FontAwesome5 name="male" size={hp(3)} color="black" />
                    }
                  />

                  <MenuItem
                    text="Nữ"
                    action={() => {
                      setGender("female");
                      checkinfoHasChanged()
                    }}
                    icon={
                      <FontAwesome5 name="female" size={hp(3)} color="black" />
                    }
                  />
                </MenuOptions>
              </Menu>
            </View>
          </View>

          {/*save button */}
          <View className="absolute bottom-28 left-0 right-0 mx-auto items-center">
            {infoHasChanged && (
              <TouchableOpacity onPress={handleSaveChanges}>
                <View className="bg-lightgrey p-4 rounded-2xl px-7">
                  <Text>Lưu</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          {userInfo?.created_at && (
            <Text className="ml-auto mt-20 italic text-neutral-500">
              Gia nhập từ: {formatDate(userInfo?.created_at)}
            </Text>
          )}
        </View>
      </LinearGradient>
    </CustomKeyboardView>
  );
}
