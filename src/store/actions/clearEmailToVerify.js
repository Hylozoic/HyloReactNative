import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMAIL_TO_VERIFY_KEY } from 'store/constants'

export default async function clearEmailToVerify () {
  console.log('!!! CLearing', await AsyncStorage.getItem(EMAIL_TO_VERIFY_KEY))
  return AsyncStorage.removeItem(EMAIL_TO_VERIFY_KEY)
}
