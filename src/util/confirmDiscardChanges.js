import { Alert } from 'react-native'

export default function confirmDiscardChanges ({
  onDiscard,
  hasChanges = true,
  title = 'You have unsaved changes',
  confirmationMessage = 'Are you sure you want to discard your changes?',
  disgardButtonText = 'Discard',
  continueButtonText = 'Continue Editing'
}) {
  if (hasChanges) {
    Alert.alert(
      title,
      confirmationMessage,
      [
        { text: disgardButtonText, onPress: onDiscard },
        { text: continueButtonText, style: 'cancel' }
      ])
  } else {
    onDiscard()
  }
}
