import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMAIL_TO_VERIFY_KEY } from 'store/constants'

export default async function setEmailToVerify (emailToVerify) {
  return AsyncStorage.setItem(EMAIL_TO_VERIFY_KEY, emailToVerify)
}
