/* eslint-disable camelcase */
import React from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from '../Comment'
import Loading from '../Loading'
import { func, array } from 'prop-types'
import styles from './Comments.styles'

export default class Comments extends React.PureComponent {
  static propTypes = {
    comments: array,
    fetchComments: func
  }

  renderComment = (comment) => {
    const {
      showMember,
      showTopic,
      slug
    } = this.props
    return <Comment
      comment={comment}
      key={comment.id}
      showMember={showMember}
      showTopic={showTopic}
      slug={slug} />
  }

  scrollToEnd (animated = true) {
    this.scrollView.scrollToEnd({animated})
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

    return <View style={{flex: 1}}>
      <ScrollView
        ref={ref => { this.scrollView = ref }}
        onContentSizeChange={(contentWidth, contentHeight) => { this.scrollToEnd() }}
      >
        {header}
        <ShowMore commentsLength={comments.length}
          total={total}
          hasMore={hasMore}
          fetchComments={fetchComments} />
        {pending && <View style={styles.loadingContainer}>
          <Loading style={styles.loading} />
        </View>}
        {comments.map(this.renderComment)}
      </ScrollView>
      {footer}
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
