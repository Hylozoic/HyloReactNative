import React from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import Loading from '../../Loading'
import StarIcon from '../../StarIcon'
import Badge from '../../Badge'
import Icon from '../../Icon'
import Header from '../Header'
import styles from './Projects.styles'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { isEmpty } from 'lodash/fp'
import Feed from '../../Feed'

const title = 'Projects'

export default class Projects extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const { communityId, currentUser, navigation, networkId } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      communityId={communityId}
      navigation={navigation}
      networkId={networkId}
      screenProps={this.props.screenProps} />
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
