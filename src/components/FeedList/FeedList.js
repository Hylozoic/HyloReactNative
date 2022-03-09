import React from 'react'
import { FlatList, View } from 'react-native'
import { isEmpty } from 'lodash/fp'
import { didPropsChange } from 'util/index'
import { useIsFocused } from '@react-navigation/native'
import PostRow from './PostRow'
import ListControl from 'components/ListControl'
import Loading from 'components/Loading'
import { isContextGroup } from 'store/models/Group'
import styles from './FeedList.styles'

export default function (props) {
  const isFocused = useIsFocused()
  return <FeedList {...props} isFocused={isFocused} />
}

export class FeedList extends React.Component {
  fetchOrShowCached () {
    const { hasMore, postIds, fetchPosts } = this.props
    if (fetchPosts && isEmpty(postIds) && hasMore !== false) {
      fetchPosts()
    }
  }

  componentDidMount () {
    this.props.isFocused && this.fetchOrShowCached()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  componentDidUpdate (prevProps) {
    if (
      (!prevProps.isFocused && this.props.isFocused) ||
      prevProps.sortBy !== this.props.sortBy ||
      prevProps.filter !== this.props.filter ||
      prevProps.timeframe !== this.props.timeframe ||
      prevProps.group?.id !== this.props.group?.id ||
      prevProps.topicName !== this.props.topicName
    ) {
      this.fetchOrShowCached()
    }
  }

  keyExtractor = (item) => `post${item}`

  render () {
    const {
      postIds,
      pendingRefresh,
      refreshPosts,
      fetchMorePosts,
      setFilter,
      setSort,
      setTimeframe,
      scrollRef,
      sortBy,
      feedType,
      filter,
      timeframe
    } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          ref={scrollRef}
          data={postIds}
          renderItem={({ item }) => renderItem({ ...this.props, item })}
          onRefresh={refreshPosts}
          refreshing={!!pendingRefresh}
          keyExtractor={this.keyExtractor}
          onEndReached={fetchMorePosts}
          ListHeaderComponent={
            <View>
              {this.props.header}
              {!feedType && (
                <View style={[styles.listControls]}>
                  <ListControl selected={sortBy} onChange={setSort} options={sortOptions} />
                  <ListControl selected={filter} onChange={setFilter} options={filterOptions} />
                </View>
              )}
              {feedType === 'event' && (
                <View style={[styles.listControls]}>
                  <ListControl selected={timeframe} onChange={setTimeframe} options={eventTimeframeOptions} />
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            this.props.pending
              ? <Loading style={styles.loading} />
              : null
          }
        />
      </View>
    )
  }
}

export function renderItem ({
  item,
  group,
  showPost,
  showMember,
  showTopic,
  goToGroup
}) {
  return (
    <PostRow
      postId={item}
      groupId={group?.id}
      showGroups={!group?.id || isContextGroup(group?.slug)}
      showPost={showPost}
      showMember={showMember}
      showTopic={showTopic}
      goToGroup={goToGroup}
    />
  )
}

export const filterOptions = [
  { id: null, label: 'All' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'offer', label: 'Offers' },
  { id: 'project', label: 'Projects' },
  { id: 'request', label: 'Requests' },
  { id: 'resource', label: 'Resources' }
]

export const sortOptions = [
  { id: 'updated', label: 'Latest Activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'votes', label: 'Popular' }
]

export const eventTimeframeOptions = [
  { id: 'future', label: 'Upcoming Events' },
  { id: 'past', label: 'Past Events' }
]
