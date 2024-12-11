import React from 'react'
import { KeyboardAvoidingView, ScrollView, Platform, View } from 'react-native'
const ios = Platform.OS == 'ios'
export default function CustomKeyboardView({children}){
    return (
        <KeyboardAvoidingView
            behavior={ios? 'padding':'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={80}
        >
            <View
                style={{flex:1}}
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            > 
                {
                    children
                }

            </View>
        </KeyboardAvoidingView>
    )
}
