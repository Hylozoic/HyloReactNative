import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './MemberFeed.styles'
import PostCard from '../../PostCard'
import Comment from '../../Comment'

const feedOptions = [
  'Posts', 'Comments', 'Upvotes'
]

export default class MemberFeed extends React.Component {
  componentDidMount () {
    this.props.fetchItems()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.id !== this.props.id || prevProps.choice !== this.props.choice) {
      this.props.fetchItems()
    }
  }

  render () {
    const { items, itemType, choice, setChoice } = this.props

    return <View style={styles.container}>
      <View style={styles.feedTabs}>
        {feedOptions.map(option =>
          <FeedTab
            key={option}
            option={option}
            chosen={option === choice}
            onPress={() => setChoice(option)}
            />)}
      </View>
      {items.map(item => itemType === 'post'
        ? <PostCard key={item.id} post={item} />
        : <Comment key={item.id} comment={item} />)}
    </View>
  }
}

export function FeedTab ({ option, chosen, onPress }) {
  return <TouchableOpacity onPress={onPress}>
    <Text style={chosen ? styles.chosenOption : styles.option}>{option}</Text>
  </TouchableOpacity>
}
