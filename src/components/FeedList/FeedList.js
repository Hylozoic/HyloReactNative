import React, { useEffect } from 'react'
import { FlatList, View, TouchableOpacity } from 'react-native'
import { isEmpty } from 'lodash/fp'
import { didPropsChange } from 'util/index'
import { useIsFocused } from '@react-navigation/native'
import { NO_POST_FILTER, getPostIds } from './FeedList.store'
import PostRow from './PostRow'
import ListControl from 'components/ListControl'
import Loading from 'components/Loading'
import { isContextGroup } from 'store/models/Group'
import styles from './FeedList.styles'
import Icon from 'components/Icon'
import { pictonBlue } from 'style/colors'
import { useTranslation } from 'react-i18next'
import useQueryAction from 'urql-shared/hooks/useQueryAction'
import fetchPosts from 'store/actions/fetchPosts'
import { useSelector } from 'react-redux'

// tracks: `hylo-evo/src/components/StreamViewControls/StreamViewControls.js`
export const POST_TYPE_OPTIONS = [
  { id: NO_POST_FILTER, label: 'All Posts' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'offer', label: 'Offers' },
  { id: 'project', label: 'Projects' },
  { id: 'proposal', label: 'Proposals' },
  { id: 'request', label: 'Requests' },
  { id: 'resource', label: 'Resources' }
]

// tracks: `hylo/hylo-evo/src/util/constants.js`
export const STREAM_SORT_OPTIONS = [
  { id: 'order', label: 'Manual' },
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'votes', label: 'Popular' }
]

// Not currently used
// tracks: `hylo/hylo-evo/src/util/constants.js`
export const COLLECTION_SORT_OPTIONS = [
  { id: 'order', label: 'Manual' },
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'votes', label: 'Popular' }
]

// tracks: `hylo-evo/src/routes/Events/Events.js`
export const EVENT_STREAM_TIMEFRAME_OPTIONS = [
  { id: 'future', label: 'Upcoming Events' },
  { id: 'past', label: 'Past Events' }
]

export default function FeedList (props) {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const [{ fetching, data: posts }] = useQueryAction({
    action: fetchPosts(props.fetchPostParam),
    pause: !isEmpty(props?.postIds) && props?.hasMore !== true
  })
  // const postIds = useSelector(getPostIds, fetchPosts(props.fetchPostParam))
  console.log('!!!!!!', props?.postIds)

  console.log('!!! fetchPosts(props.fetchPostParam):', fetchPosts(props.fetchPostParam))
  // Explicit invocation of dynamic strings
  t('All Posts')
  t('Discussions')
  t('Events')
  t('Offers')
  t('Projects')
  t('Proposals')
  t('Requests')
  t('Resources')
  t('Manual')
  t('Latest activity')
  t('Post Date')
  t('Popular')
  t('Upcoming Events')
  t('Past Events')

  if (fetching) return <Loading />

  return <FeedListClassComponent {...props} postsisFocused={isFocused} t={t} />
}

export class FeedListClassComponent extends React.Component {
  handleChildPostToggle = () => {
    const childPostInclusion = this.props.fetchPostParam.childPostInclusion === 'yes' ? 'no' : 'yes'
    this.props.updateUserSettings({ settings: { streamChildPosts: childPostInclusion } })
  }

  keyExtractor = (item) => `post${item}`

  render () {
    const {
      fetchPostParam,
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
      timeframe,
      customPostTypes
    } = this.props

    const context = fetchPostParam?.context
    console.log('!!!!!!', postIds)
    const extraToggleStyles = fetchPostParam.childPostInclusion === 'yes'
      ? {
          backgroundColor: pictonBlue
        }
      : {
          backgroundColor: '#FFFFFF'
        }
    return (
      <View style={styles.container}>
        <FlatList
          ref={scrollRef}
          data={postIds}
          renderItem={({ item }) => renderPostRow({ ...this.props, postId: item })}
          // onRefresh={refreshPosts}
          // refreshing={!!pendingRefresh}
          keyExtractor={this.keyExtractor}
          onEndReached={fetchMorePosts}
          ListHeaderComponent={
            <View>
              {this.props.header}
              {!feedType && (
                <View style={[styles.listControls]}>
                  <ListControl selected={sortBy} onChange={setSort} options={STREAM_SORT_OPTIONS} />
                  <View style={styles.steamControlRightSide}>
                    {!['my', 'public'].includes(context) &&
                      <TouchableOpacity onPress={this.handleChildPostToggle}>
                        <View style={{ ...styles.childGroupToggle, ...extraToggleStyles }}><Icon name='Subgroup' color={fetchPostParam.childPostInclusion === 'yes' ? '#FFFFFF' : pictonBlue} /></View>
                      </TouchableOpacity>}
                    {!customPostTypes && <ListControl selected={filter} onChange={setFilter} options={POST_TYPE_OPTIONS} />}
                  </View>
                </View>
              )}
              {feedType === 'event' && (
                <View style={[styles.listControls]}>
                  <ListControl selected={timeframe} onChange={setTimeframe} options={EVENT_STREAM_TIMEFRAME_OPTIONS} />
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

export function renderPostRow ({
  postId,
  fetchPostParam,
  forGroup,
  showPost,
  showMember,
  showTopic,
  goToGroup
}) {
  return (
    <PostRow
      context={fetchPostParam?.context}
      postId={postId}
      forGroupId={forGroup?.id}
      showGroups={!forGroup?.id || isContextGroup(forGroup?.slug)}
      showPost={showPost}
      showMember={showMember}
      showTopic={showTopic}
      goToGroup={goToGroup}
    />
  )
}
