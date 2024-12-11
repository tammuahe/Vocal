import {useState} from "react";
import { Modal, View, Text, Pressable } from "react-native";

export default function ModalApp({children, width = 100, height = 250, isvisible = false, onClose, confirmText = 'Đồng ý', confrimColor = "red", onConfirm}) {

    
    return (
        <Modal 
            visible={isvisible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View  className=" flex-1 items-center justify-center ">
                <View className=" bg-white elevation-md shadow-black rounded-xl">
                    <View className="p-10">
                        {children}
                    </View>
                    <View className="flex-row items-center border-t-[1px] border-gray-300">
                        <Pressable className="p-4 flex-1" onPress={onClose}>
                            <Text className="text-[#428DF0] text-xl text-center">Hủy</Text>
                        </Pressable>
                        <View className="h-full w-[1px] bg-gray-300"></View>
                        <Pressable className="p-4 flex-1" onPress={onConfirm}>
                            <Text style={{color: confrimColor}} className="text-xl text-center">{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}