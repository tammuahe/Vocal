import {View, Text,TextInput} from 'react-native';
import SharedLayout from '@/components/SharedLayout';
import ReturnBackIcon from '../../assets/icons/return-back-button-svgrepo-com-light.svg';
import { useRouter } from 'expo-router';

export default function AddFriend() {
    const router = useRouter();
    return (
        <SharedLayout headerTitle="Bạn bè" leftIcon={<ReturnBackIcon onPress={() => router.back()}/>}>
            
            <View className='flex-1'>
                <TextInput className='w-full bg-white rounded-full px-6 py-4 mt-2 text-base' placeholder='Search'/>

            </View>
        </SharedLayout>
    )
}