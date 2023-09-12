import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'components/Icon'
import { rhino05, slateGrey80 } from 'style/colors'
import useEnsureGroupTopics from 'hooks/useEnsureGroupTopics'
import { openURL } from 'hooks/useOpenURL'
import Badge from 'components/Badge'
import Loading from 'components/Loading/Loading'

export default function TopicsNavigation ({ group }) {
  const { pending, topics } = useEnsureGroupTopics({ groupId: group?.id, groupSlug: group?.slug })
  if (pending) return (<Loading />)
  return (
    <View style={{marginBottom: 20}}>
      {topics.map((topic, index) => (
        <TopicItem
          label={topic.name}
          iconName='Topics'
          topic={topic}
          key={index}
          onPress={() => openURL(topic.url)}
        />
      ))}
    </View>
  )
}

const TopicItem = ({ label, iconName, onPress, topic }) => (
  <TouchableOpacity style={styles.topicItem} onPress={onPress} key={label}>
    <View style={styles.topicSubItem}>
      <Icon style={styles.topicItemIcon} name={iconName} />
      <Text style={styles.topicItemLabel}>{label}</Text>
    </View>
    <View style={[styles.topicSubItem, styles.topicRightSide]}>
      {topic.newPostCount > 0 && <Badge count={topic.newPostCount} />}
      {topic.isSubscribed && (<Icon style={styles.topicItemIcon} name='Pin' />)}
    </View>
  </TouchableOpacity>
)

const styles = {
  topicItemLabel: {
    color: rhino05,
    fontSize: 16
  },
  topicItemIcon: {
    color: rhino05,
    fontSize: 16
  },
  topicItem: {
    color: slateGrey80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    justifyContent: 'space-between'
  },
  topicSubItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topicRightSide: {
    marginRight: 20,
    gap: 4
  }
}
