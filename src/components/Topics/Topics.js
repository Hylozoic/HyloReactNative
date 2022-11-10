import { ScrollView, Text, TouchableOpacity } from 'react-native'
import Icon from 'components/Icon'
import { amaranth, caribbeanGreen, rhino30 } from 'style/colors'

export default function Topics ({
  onPress,
  onPressRemove,
  topics,
  style,
  pillStyle
}) {
  if (topics.length < 1) return null

  return (
    <ScrollView horizontal style={[styles.topicPillBox, style]}>
      {topics.map((topic, index) => (
        <TopicPill
          style={pillStyle}
          topic={topic}
          onPress={onPress}
          onPressRemove={onPressRemove}
          key={index}
        />
      ))}
    </ScrollView>
  )
}

export function TopicPill ({
  topic, topic: { name },
  style,
  onPress,
  onPressRemove
}) {
  const handleOnPress = onPress
    ? () => onPress(topic)
    : () => {}
  const handleOnPressRemove = onPressRemove
    ? () => onPressRemove(topic)
    : () => {}

  return (
    <TouchableOpacity onPress={handleOnPress} style={[styles.topicPill, style]}>
      <Text style={styles.topicText}>#{name}</Text>
      <TouchableOpacity onPress={handleOnPressRemove}>
        <Icon name='Ex' style={styles.topicRemove} />
      </TouchableOpacity>
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