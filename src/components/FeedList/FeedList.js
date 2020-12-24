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
    this.fetchOrShowCached()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  componentDidUpdate (prevProps) {
    if (
        !prevProps.isFocused && this.props.isFocused  ||
        prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter ||
        prevProps.community?.id !== this.props.community?.id ||
        prevProps.topicName !== this.props.topicName ||
        prevProps.network?.id !== this.props.network?.id
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
              <ListControls
                filter={this.props.filter}
                sortBy={this.props.sortBy}
                setFilter={setFilter}
                setSort={setSort}
                pending={this.props.pending}
                hideListFilter={isProjectFeed}
              />
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
  communityId,
  showPost,
  showMember,
  showTopic,
  goToCommunity
}) {
  return (
    <PostRow
      postId={item}
      communityId={communityId}
      shouldShowCommunities={!communityId}
      showPost={showPost}
      showMember={showMember}
      showTopic={showTopic}
      goToCommunity={goToCommunity}
    />
  )
}

export const filterOptions = [
  { id: null, label: 'All Posts' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'request', label: 'Requests' },
  { id: 'offer', label: 'Offers' }
]

// const sortOptions = [
//   {id: 'updated', label: 'Latest'},
//   {id: 'votes', label: 'Popular'}
// ]

const optionText = (id, options) => {
  const option = find(o => o.id === id, options) || options[0]
  return option.label
}

export function ListControls ({ filter: listFilter, sortBy, setFilter, setSort, hideListFilter }) {
  return (
    <View style={[styles.listControls, hideListFilter ? styles.listControlsSingleItem : {}]}>
      {!hideListFilter &&
        <ListControl selected={listFilter} onChange={setFilter} options={filterOptions} />}
      {/* TODO: disabled  */}
      {/* <ListControl selected={sortBy} onChange={setSort} options={sortOptions} /> */}
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
