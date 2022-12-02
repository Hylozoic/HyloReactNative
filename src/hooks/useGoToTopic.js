import { useNavigation } from '@react-navigation/native'
import useIsModalScreen from './useIsModalScreen'

export default function useGoToTopic () {
  const navigation = useNavigation()
  const isModalScreen = useIsModalScreen()

  return topicName => {
    if (isModalScreen) {
      return null
    } else {
      return navigation.navigate('Chat', { topicName })
    }
  }
}
