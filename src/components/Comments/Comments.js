/* eslint-disable camelcase */
import React from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'

export default class Comments extends React.PureComponent {  
  scrollViewRef = React.createRef()

  renderComment = (comment) => {
    const {
      showMember,
      showTopic,
      slug
    } = this.props
    return (
      <Comment
        comment={comment}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug}
        key={comment.id}
      />
    )
  }

  scrollToEnd = (animated = true) => {
    this.scrollViewRef.current.scrollToEnd({ animated })
  }

  componentDidMount () {
    this.scrollToEnd({ animated: true })
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

    return (
      <ScrollView ref={this.scrollViewRef} onContentSizeChange={this.scrollToEnd} style={{ flex: 1 }}>
        {header}
        <ShowMore
          commentsLength={comments.length}
          total={total}
          hasMore={hasMore}
          fetchComments={fetchComments}
        />
        {pending && <View style={styles.loadingContainer}>
          <Loading style={styles.loading} />
        </View>}
        {comments.map(this.renderComment)}
      </ScrollView>
    )
  }
}

export function ShowMore ({ total = 0, hasMore, fetchComments }) {
  const extra = total - 10

  if (!hasMore || extra < 1) return null

  return (
    <TouchableOpacity>
      <Text style={styles.showMore} onPress={fetchComments}>
        View {extra} previous comment{extra > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  )
}
