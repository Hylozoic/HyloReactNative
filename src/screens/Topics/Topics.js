import React from 'react'
import { Text, ScrollView, Image, View, TouchableOpacity, TextInput } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Loading from 'components/Loading'
import StarIcon from 'components/StarIcon'
import Badge from 'components/Badge'
import SearchBar from 'components/SearchBar'
import styles from './Topics.styles'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import LinearGradient from 'react-native-linear-gradient'
import { isEmpty, get } from 'lodash/fp'
import { bannerlinearGradientColors } from 'style/colors'
import TopicSupportComingSoon from './TopicSupportComingSoon'

export default class Topics extends React.Component {
  componentDidMount () {
    if (!this.props.networkId) {
      this.props.fetchCommunityTopics()
    }
  }

  componentDidUpdate (prevProps) {
    if (
      (get('community.id', prevProps) !== get('community.id', this.props)) ||
      (get('networkId', prevProps) && !get('networkId', this.props))
    ) {
      this.props.fetchCommunityTopics()
    }
  }

  render () {
    if (!this.props.community?.id) {
      return <TopicSupportComingSoon navigation={this.props.navigation} />
    }

    const {
      communityHasTopics, community, filteredTopics, pending, setTopicSubscribe, goToTopic, searchTerm, setTerm
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
            value={searchTerm}
            onChangeText={setTerm}
            placeholder='Search Topics'
            disable={!communityHasTopics}
          />
          {pending && isEmpty(filteredTopics)
            ? <Loading />
            : <TopicList
                communityHasTopics={communityHasTopics}
                searchTerm={searchTerm}
                filteredTopics={filteredTopics}
                setTopicSubscribe={setTopicSubscribe}
                goToTopic={goToTopic}
              />}
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}

export function TopicList ({
  communityHasTopics,
  filteredTopics,
  setTopicSubscribe,
  searchTerm,
  goToTopic
}) {
  if (!communityHasTopics) return (
    <View style={styles.topicList}>
      <Text style={styles.emptyList}>No topics were found for this community</Text>
    </View>
  )
  return (
    <View style={styles.topicList}>
      {isEmpty(filteredTopics) && searchTerm && (
        <Text style={styles.emptyList}>No topics matched "{searchTerm}"</Text>
      )}
      {!isEmpty(filteredTopics) && filteredTopics.map((topic, i) => (
        <TopicRow
          topic={topic} key={i} first={i === 0}
          setTopicSubscribe={setTopicSubscribe}
          goToTopic={goToTopic}
        />
      ))}
    </View>
  )
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
