import { useNavigation } from '@react-navigation/native'
import { isContextGroup } from 'store/models/Group'
import useCurrentGroup from './useCurrentGroup'
import useIsModalScreen from './useIsModalScreen'

export default function useGoToTopic () {
  const navigation = useNavigation()
  const isModalScreen = useIsModalScreen()
  const [currentGroup] = useCurrentGroup()

  return topicName => {
    if (isModalScreen) {
      return null
    } else {
      if (isContextGroup(currentGroup?.slug)) {
        return navigation.navigate('Feed', { topicName })
      } else {
        return navigation.navigate('Chat', { topicName })
      }
    }
  }
}
