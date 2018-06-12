/* eslint-disable camelcase */
import React from 'react'
import { Text, TouchableOpacity, View, FlatList } from 'react-native'
import Comment from '../Comment'
import Loading from '../Loading'
import { func, array } from 'prop-types'
import styles from './Comments.styles'

export default class Comments extends React.PureComponent {
  static propTypes = {
    comments: array,
    fetchComments: func
  }

  render () {
    const {
      comments,
      header,
      footer,
      pending,
      total,
      hasMore,
      fetchComments,
      showMember,
      showTopic,
      slug
    } = this.props

    const listHeaderComponent = <View>
      {header}
      {pending && <Loading style={styles.loading} />}
      <ShowMore commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
    </View>

    const listFooterComponent = <View style={styles.footer}>
      {footer}
    </View>

    return <FlatList
      keyboardShouldPersistTaps={'handled'}
      data={comments}
      renderItem={({ item }) => <Comment
        comment={item}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug} />}
      keyExtractor={(item, index) => item.id}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={listFooterComponent}
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
