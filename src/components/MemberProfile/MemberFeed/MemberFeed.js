import React from 'react'
import { Text, View, TouchableOpacity, FlatList } from 'react-native'
import styles from './MemberFeed.styles'
import PostCard from '../../PostCard'
import Comment from '../../Comment'
import Loading from '../../Loading'

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
    const { items, itemType, choice, setChoice, header, fetchMoreItems, pending } = this.props

    const listHeaderComponent = <View>
      {header}
      <View style={styles.feedTabs}>
        {feedOptions.map(option =>
          <FeedTab
            key={option}
            option={option}
            chosen={option === choice}
            onPress={() => setChoice(option)}
            />)}
      </View>
    </View>

    const listFooterComponent = <View style={styles.footer}>
      {pending && <Loading />}
    </View>

    return <View style={styles.superContainer}><FlatList
      data={items}
      renderItem={({ item }) => <ContentRow item={item} itemType={itemType} />}
      keyExtractor={item => item.id}
      onEndReached={fetchMoreItems}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={listFooterComponent}
      contentContainerStyle={styles.container} />
    </View>
  }
}

export function ContentRow ({ item, itemType }) {
  var content
  if (itemType === 'post') {
    content = <PostCard post={item} />
  } else {
    content = <Comment comment={item} />
  }
  return <View style={styles.contentRow}>
    {content}
  </View>
}

export function FeedTab ({ option, chosen, onPress }) {
  return <TouchableOpacity onPress={onPress}>
    <Text style={chosen ? styles.chosenOption : styles.option}>{option}</Text>
  </TouchableOpacity>
}
