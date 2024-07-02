import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, View, TouchableOpacity } from 'react-native'
import { isEmpty, get } from 'lodash/fp'
import { useIsFocused } from '@react-navigation/native'
import {
  getSort,
  getFilter,
  getTimeframe,
  setSort,
  setFilter as setFilterAction,
  setTimeframe as setTimeframeAction,
  getPostIds,
  getHasMorePosts,
  getQueryProps,
  NO_POST_FILTER
} from './FeedList.store'
import { FETCH_POSTS } from 'store/constants'
import { ALL_GROUP_ID, isContextGroup, MY_CONTEXT_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import getMe from 'store/selectors/getMe'
import fetchPosts from 'store/actions/fetchPosts'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import updateUserSettings from 'store/actions/updateUserSettings'
import PostRow from './PostRow'
import ListControl from 'components/ListControl'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import { pictonBlue } from 'style/colors'
import styles from './FeedList.styles'

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

const FeedList = (props) => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const {
    forGroup, topicName, customView, myHome, feedType, header, scrollRef
  } = props
  const currentUser = useSelector(getMe)

  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const childPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'
  const postTypeFilter = props?.feedType ||
    useSelector(state => getFilter(state, props)) ||
    get('settings.streamPostType', currentUser) ||
    null
  const customViewSort = customView?.defaultSort

  let sortBy = customViewSort ||
    useSelector(state => getSort(state, props)) ||
    get('settings.streamSortBy', currentUser) ||
    'updated'

  if (!customView && sortBy === 'order') {
    sortBy = 'updated'
  }

  const timeframe = useSelector(state => getTimeframe(state, props))
  const activePostsOnly = customView?.activePostsOnly
  const customViewType = customView?.type
  const customPostTypes = customViewType === 'stream' ? customView?.postTypes : null
  const customViewTopics = customViewType === 'stream' ? customView?.topics : null

  const customViewCollectionId = customView?.collectionId

  let fetchPostParam = useSelector(state => getQueryProps(state, {
    activePostsOnly,
    childPostInclusion,
    forCollection: customViewCollectionId,
    context: isContextGroup(forGroup?.slug) ? forGroup.slug : myHome ? 'my' : 'groups',
    myHome,
    slug: myHome ? undefined : forGroup?.slug,
    topicName,
    sortBy,
    topics: customViewTopics?.toModelArray().map(t => t.id) || null,
    types: customPostTypes,
    filter: postTypeFilter === NO_POST_FILTER ? null : postTypeFilter
  }))

  if (myHome === 'Mentions') fetchPostParam.mentionsOf = [currentUser.id]
  if (myHome === 'Announcements') fetchPostParam.announcementsOnly = true
  if (myHome === 'Interactions') fetchPostParam.interactedWithBy = [currentUser.id]
  if (myHome === 'My Posts') fetchPostParam.createdBy = [currentUser.id]

  if (props.feedType === 'event') {
    fetchPostParam = {
      ...fetchPostParam,
      order: timeframe === 'future' ? 'asc' : 'desc',
      afterTime: timeframe === 'future' ? new Date().toISOString() : null,
      beforeTime: timeframe === 'past' ? new Date().toISOString() : null
    }
  }

  const pending = useSelector(state => state.pending[FETCH_POSTS])
  const postIds = useSelector(state => getPostIds(state, fetchPostParam))
  const hasMore = useSelector(state => getHasMorePosts(state, fetchPostParam))

  const fetchPostsAndResetCount = useCallback(() => {
    const forGroupId = get('id', forGroup)
    const shouldReset = slug => (
      slug !== ALL_GROUP_ID &&
      slug !== PUBLIC_GROUP_ID &&
      slug !== MY_CONTEXT_ID &&
      !topicName &&
      sortBy === defaultSortBy &&
      !postTypeFilter
    )

    if (shouldReset(fetchPostParam.context)) {
      dispatch(resetNewPostCount(forGroupId, 'Membership'))
    }

    dispatch(fetchPosts(fetchPostParam))
  }, [fetchPostParam, forGroup?.id, sortBy, postTypeFilter, topicName])

  const refreshPosts = useCallback(() => dispatch(fetchPosts(fetchPostParam, { reset: true })), [fetchPostParam])
  const fetchMorePosts = useCallback(() => {
    if (hasMore && !pending) {
      dispatch(fetchPosts({ ...fetchPostParam, offset: postIds.length }))
    }
  }, [dispatch, hasMore, pending, fetchPostParam, postIds.length])
  const handleChildPostToggle = () => {
    const childPostInclusion = fetchPostParam.childPostInclusion === 'yes' ? 'no' : 'yes'
    dispatch(updateUserSettings({ settings: { streamChildPosts: childPostInclusion } }))
  }
  const setFilter = filterType => dispatch(setFilterAction(filterType))
  const setTimeframe = timeframe => dispatch(setTimeframeAction(timeframe))

  useEffect(() => {
    if (isFocused && isEmpty(postIds) && hasMore !== false) {
      fetchPostsAndResetCount()
    }
  }, [isFocused, postIds, hasMore, fetchPostsAndResetCount])

  const extraToggleStyles = fetchPostParam.childPostInclusion === 'yes'
    ? { backgroundColor: pictonBlue }
    : { backgroundColor: '#FFFFFF' }

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={postIds}
        renderItem={({ item }) => renderPostRow({ ...props, postId: item })}
        onRefresh={refreshPosts}
        refreshing={!!pending}
        keyExtractor={item => `post${item}`}
        onEndReached={fetchMorePosts}
        ListHeaderComponent={
          <View>
            {header}
            {!feedType && (
              <View style={[styles.listControls]}>
                <ListControl selected={sortBy} onChange={setSort} options={STREAM_SORT_OPTIONS} />
                <View style={styles.steamControlRightSide}>
                  {!['my', 'public'].includes(fetchPostParam.context) &&
                    <TouchableOpacity onPress={handleChildPostToggle}>
                      <View style={{ ...styles.childGroupToggle, ...extraToggleStyles }}>
                        <Icon name='Subgroup' color={fetchPostParam.childPostInclusion === 'yes' ? '#FFFFFF' : pictonBlue} />
                      </View>
                    </TouchableOpacity>}
                  {!customPostTypes && (
                    <ListControl selected={postTypeFilter} onChange={setFilter} options={POST_TYPE_OPTIONS} />
                  )}
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
        ListFooterComponent={pending ? <Loading style={styles.loading} /> : null}
      />
    </View>
  )
}

const renderPostRow = ({
  postId,
  fetchPostParam,
  forGroup,
  showPost,
  showMember,
  showTopic,
  goToGroup
}) => (
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

export default FeedList
