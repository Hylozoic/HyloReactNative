/* eslint-disable camelcase */
import React from 'react'
import { Text, TouchableOpacity, View, FlatList } from 'react-native'
import Comment from '../Comment'
import Loading from '../Loading'
const { func, array } = React.PropTypes
import styles from './Comments.styles'

export default class Comments extends React.Component {
  static propTypes = {
    comments: array,
    fetchComments: func
  }

  render () {
    const {
      comments,
      header,
      pending,
      total,
      hasMore,
      fetchComments
    } = this.props

    const listHeaderComponent = <View>
      {header}
      {pending && <Loading />}
      <ShowMore commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
    </View>

    return <FlatList
      data={comments}
      renderItem={({ item }) => <Comment comment={item} />}
      keyExtractor={(item, index) => item.id}
      ListHeaderComponent={listHeaderComponent}
    />
  }
}

export function ShowMore ({total, hasMore, fetchComments}) {
  if (!hasMore) return null

  const extra = total - 10

  return <TouchableOpacity>
    <Text style={styles.showMore} onPress={fetchComments}>
    View {extra} previous comment{extra > 1 ? 's' : ''}
    </Text>
  </TouchableOpacity>
}
