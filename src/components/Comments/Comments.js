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

  keyExtractor = (item) => item.id

  renderItem = ({item}) => {
    const {
      showMember,
      showTopic,
      slug
    } = this.props
    return <Comment
      comment={item}
      showMember={showMember}
      showTopic={showTopic}
      slug={slug} />
  }

  render () {
    const {
      comments = [],
      header,
      footer,
      pending,
      total,
      hasMore,
      fetchComments
    } = this.props

    const headerComponent = <View>
      {header}
      <ShowMore commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments} />
      {pending && <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>}
    </View>

    return <View>
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        data={comments}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={footer}
      />
    </View>
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
