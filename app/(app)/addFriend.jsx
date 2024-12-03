import {View, Text,TextInput} from 'react-native';
import SharedLayout from '@/components/SharedLayout';

export default function AddFriend() {

    return (
        <SharedLayout headerTitle="Friends">
            
            <View className='flex-1'>
                <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Search'/>

            </View>
        </SharedLayout>
    )
}