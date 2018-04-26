import React from 'react'
import { Text, ScrollView, Image, View, TouchableOpacity, TextInput } from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import Loading from '../../Loading'
import StarIcon from '../../StarIcon'
import Badge from '../../Badge'
import Icon from '../../Icon'
import Header from '../Header'
import styles from './Topics.styles'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import LinearGradient from 'react-native-linear-gradient'
import { isEmpty, get } from 'lodash/fp'

const title = 'Topics'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

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
    const image = {uri: bannerUrl}

    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bannerContainer}>
          {image && <Image source={image} style={styles.image} />}
          <LinearGradient style={styles.gradient}
            colors={[
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0.1)',
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.6)'
            ]} />
          <Text style={styles.title}>{name}</Text>
        </View>
        <SearchBar term={term} setTerm={setTerm} />
        {pending && isEmpty(topics)
          ? <Loading />
          : <TopicList topics={topics}
            setTopicSubscribe={setTopicSubscribe}
            goToTopic={goToTopic} />}
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export function SearchBar ({ term, setTerm }) {
  return <View style={styles.searchBar}>
    <Icon style={styles.searchIcon} name='Search' />
    <TextInput
      style={styles.searchInput}
      value={term}
      onChangeText={setTerm}
      placeholder='Search Topics'
      underlineColorAndroid='transparent'
      autoCorrect={false}
      editable />
  </View>
}

export class TopicList extends React.Component {
  render () {
    const { topics, setTopicSubscribe, goToTopic } = this.props
    return <View style={styles.topicList}>
      {isEmpty(topics)
        ? <Text style={styles.emptyList}>No topics match your search</Text>
        : topics.map((topic, i) =>
          <TopicRow topic={topic} key={i} first={i === 0}
            setTopicSubscribe={setTopicSubscribe}
            goToTopic={goToTopic} />)}
    </View>
  }
}

export function TopicRow ({ topic, first, setTopicSubscribe, goToTopic }) {
  const { name, newPostCount, isSubscribed } = topic
  return <TouchableOpacity style={[styles.topicRow, first && styles.firstRow]}
    onPress={() => goToTopic(topic.name)}>
    <SubscribeStar isSubscribed={isSubscribed} onPress={() => setTopicSubscribe(topic.id, !isSubscribed)} />
    <Text style={styles.topicName}>#{name}</Text>
    <View style={styles.rightItems}>
      <Badge style={styles.badge} count={newPostCount} />
      <EntypoIcon style={styles.chevron} name={'chevron-right'} />
    </View>
  </TouchableOpacity>
}

export function SubscribeStar ({ isSubscribed, onPress }) {
  const theme = isSubscribed
    ? styles.subscribedStar
    : styles.unSubscribedStar
  return <TouchableOpacity style={styles.star}
    onPress={() => onPress(!isSubscribed)}
    hitSlop={{top: 10, bottom: 10, left: 15, right: 15}}>
    <StarIcon theme={theme} />
  </TouchableOpacity>
}
