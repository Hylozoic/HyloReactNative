import { ScrollView, Text, TouchableOpacity } from 'react-native'
import Icon from 'components/Icon'
import { amaranth, caribbeanGreen, rhino30 } from 'style/colors'

export default function Topics ({ onPress, topics, style }) {
  if (topics.length < 1) return null

  return (
    <ScrollView horizontal style={[styles.topicPillBox, style]}>
      {topics.map((t, i) => (
        <TopicPill key={i} topic={t} onPress={onPress(t)} />
      ))}
    </ScrollView>
  )
}

export function TopicPill ({ topic, topic: { name }, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.topicPill}>
      <Text style={styles.topicText}>#{name}</Text>
      <Icon name='Ex' style={styles.topicRemove} />
    </TouchableOpacity>
  )
}

const styles = {
  topicPillBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  topicPill: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: rhino30,
    marginTop: 5,
    marginRight: 5,
    paddingVertical: 4,
    paddingHorizontal: 7,
    paddingRight: 5,
    fontSize: 14
  },
  topicRemove: {
    color: amaranth,
    fontSize: 16,
    marginLeft: 10
  },
  topicText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold',
    fontSize: 16
  }
}