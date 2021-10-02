import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { find, isEmpty, includes } from 'lodash/fp'
import { didPropsChange } from 'util/index'
import styles from './FeedList.styles'
import PostRow from './PostRow'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import PopupMenuButton from 'components/PopupMenuButton'

export default class FeedList extends React.Component {
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
        !prevProps.isFocused && this.props.isFocused  ||
        prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter ||
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
      isProjectFeed,
      refreshPosts,
      fetchMorePosts,
      setFilter,
      setSort,
      scrollRef
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
              {!isProjectFeed && (
                <ListControls
                  filter={this.props.filter}
                  sortBy={this.props.sortBy}
                  setFilter={setFilter}
                  setSort={setSort}
                  pending={this.props.pending}
                />
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
  groupId,
  showPost,
  showMember,
  showTopic,
  goToGroup
}) {
  return (
    <PostRow
      postId={item}
      groupId={groupId}
      shouldShowGroups={!groupId}
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

const sortOptions = [
  {id: 'updated', label: 'Latest Activity'},
  {id: 'created', label: 'Post Date'},
  {id: 'votes', label: 'Popular'}
]

const optionText = (id, options) => {
  const option = find(o => o.id === id, options) || options[0]
  return option.label
}

export function ListControls ({ filter: listFilter, sortBy, setFilter, setSort }) {
  return (
    <View style={[styles.listControls]}>
      <ListControl selected={sortBy} onChange={setSort} options={sortOptions} />
      <ListControl selected={listFilter} onChange={setFilter} options={filterOptions} />
    </View>
  )
}

export function ListControl ({ selected, options, onChange }) {
  const actions = options.map(option => [
    option.label,
    () => onChange(option.id)
  ])

  return (
    <PopupMenuButton
      actions={actions}
      style={styles.listControl}
    >
      <Text style={styles.optionText}>{optionText(selected, options)}</Text>
      <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
    </PopupMenuButton>
  )
}
