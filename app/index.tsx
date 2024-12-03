import Loading from '../components/Loading.jsx';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, View } from 'react-native'

export default function Index() {
  return (
    <View className='flex-1 items-center'>
       <Loading size={hp(20)}/>
    </View>
  );
}

