import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMAIL_TO_VERIFY_KEY } from 'store/constants'

export default async function getEmailToVerify () {  
  return AsyncStorage.getItem(EMAIL_TO_VERIFY_KEY)
}
