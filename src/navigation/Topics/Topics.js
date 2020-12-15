import React from 'react'
import { Text, ScrollView, Image, View, TouchableOpacity, TextInput } from 'react-native'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import Loading from 'components/Loading'
import StarIcon from 'components/StarIcon'
import Badge from 'components/Badge'
import SearchBar from 'components/SearchBar'
import styles from './Topics.styles'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import LinearGradient from 'react-native-linear-gradient'
import { isEmpty, get } from 'lodash/fp'
import { bannerlinearGradientColors } from 'style/colors'

export default class Topics extends React.Component {
  componentDidMount () {
    if (this.props.shouldRedirect) {
      return this.props.goToComingSoon()
    }
    this.props.fetchCommunityTopics()
  }

  componentDidUpdate (prevProps) {
    const shouldRedirect =
      (this.props.isFocused && !prevProps.shouldRedirect && this.props.shouldRedirect) ||
      (this.props.shouldRedirect && !prevProps.isFocused && this.props.isFocused)

    if (shouldRedirect) {
      return this.props.goToComingSoon()
    }

    if (get('community.id', prevProps) !== get('props.community.id', this)) {
      this.props.fetchCommunityTopics()
    }
  }

  render () {
    const {
      community, topics, pending, setTopicSubscribe, goToTopic, term, setTerm
    } = this.props
    const bannerUrl = get('bannerUrl', community)
    const name = get('name', community)
    const image = { uri: bannerUrl }

    return (
      <KeyboardFriendlyView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.bannerContainer}>
            {image && <Image source={image} style={styles.image} />}
            <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
            <Text style={styles.title}>{name}</Text>
          </View>
          <SearchBar
            value={term}
            onChangeText={setTerm}
            placeholder='Search Topics'
          />
          {pending && isEmpty(topics)
            ? <Loading />
            : <TopicList
                topics={topics}
                setTopicSubscribe={setTopicSubscribe}
                goToTopic={goToTopic}
              />}
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}
export class TopicList extends React.Component {
  render () {
    const { topics, setTopicSubscribe, goToTopic } = this.props
    return (
      <View style={styles.topicList}>
        {isEmpty(topics)
          ? <Text style={styles.emptyList}>No topics match your search</Text>
          : topics.map((topic, i) =>
            <TopicRow
              topic={topic} key={i} first={i === 0}
              setTopicSubscribe={setTopicSubscribe}
              goToTopic={goToTopic}
            />)}
      </View>
    )
  }
}

export function TopicRow ({ topic, first, setTopicSubscribe, goToTopic }) {
  const { name, newPostCount, isSubscribed } = topic
  return (
    <TouchableOpacity
      style={[styles.topicRow, first && styles.firstRow]}
      onPress={() => goToTopic(topic.name)}
    >
      <SubscribeStar isSubscribed={isSubscribed} onPress={() => setTopicSubscribe(topic.id, !isSubscribed)} />
      <Text style={styles.topicName}>#{name}</Text>
      <View style={styles.rightItems}>
        <Badge style={styles.badge} count={newPostCount} />
        <EntypoIcon style={styles.chevron} name='chevron-right' />
      </View>
    </TouchableOpacity>
  )
}

export function SubscribeStar ({ isSubscribed, onPress }) {
  const theme = isSubscribed
    ? styles.subscribedStar
    : styles.unSubscribedStar
  return (
    <TouchableOpacity
      style={styles.star}
      onPress={() => onPress(!isSubscribed)}
      hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
    >
      <StarIcon theme={theme} />
    </TouchableOpacity>
  )
}
