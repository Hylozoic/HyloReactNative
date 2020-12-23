import { Alert } from 'react-native'

export default function confirmNavigate (onConfirm, options) {
  options = {
    title: 'Changing context',
    confirmationMessage: 'Are you sure you want to navigate away from this area?',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    ...options
  }

  Alert.alert(
    options.title,
    options.confirmationMessage,
    [
      { text: options.confirmButtonText, onPress: onConfirm },
      { text: options.cancelButtonText, style: 'cancel' }
    ]
  )  
}
