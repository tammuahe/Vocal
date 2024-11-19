import Loading from '../components/Loading.jsx';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Index() {
  return (
    <Loading size={hp(20)}/>
  );
}
