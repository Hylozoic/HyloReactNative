import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { propsChanged } from 'util/index'
import styles from './FeedList.styles'
import PostCard from '../PostCard'
import Loading from '../Loading'
import Icon from '../Icon'
import PopupMenuButton from '../PopupMenuButton'
import { find, get, isEmpty, filter } from 'lodash/fp'
import { some } from 'lodash'
export default class FeedList extends React.Component {
  fetchOrShowCached () {
    const { hasMore, posts, fetchPosts, pending } = this.props
    if (fetchPosts && isEmpty(posts) && hasMore !== false && !pending) {
      fetchPosts()
    }
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && propsChanged(this.props, nextProps)
  }

  componentDidUpdate (prevProps) {
    // The first two checks below prevent data from being loaded until the Home
    // tab is actually visible.
    //
    // This implementation causes a pretty strong coupling between FeedList and
    // the Home tab, both by hard-coding the tab name and by using screenProps,
    // which we had to pass down from the Home component through Feed. This will
    // have to be reworked to allow opening topic feeds in the Topic tab, e.g.
    if (this.props.screenProps.currentTabName !== 'Home') {
      return
    }
    if (!prevProps || prevProps.screenProps.currentTabName !== 'Home') {
      return this.fetchOrShowCached()
    }
    if (prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter ||
        get('id', prevProps.community) !== get('id', this.props.community) ||
        get('id', prevProps.network) !== get('id', this.props.network)) {
      this.fetchOrShowCached()
    }
  }

  render () {
    const {
      posts,
      networkId,
      filter: listFilter,
      sortBy,
      setFilter,
      setSort,
      pending,
      header,
      showPost,
      showMember,
      showTopic,
      showCommunities,
      goToCommunity
    } = this.props
    const listHeaderComponent = <View>
      {header}
      <ListControls
        filter={listFilter}
        sortBy={sortBy}
        setFilter={setFilter}
        setSort={setSort}
        pending={pending}
      />
    </View>

    const listFooterComponent = pending
      ? <Loading style={styles.loading} />
      : null

    return <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) =>
          <PostRow
            post={item}
            showPost={showPost}
            showMember={showMember}
            showTopic={showTopic}
            showCommunity={showCommunities}
            goToCommunity={goToCommunity}
            selectedNetworkId={networkId} />}
        onRefresh={this.props.refreshPosts}
        refreshing={!!this.props.pendingRefresh}
        keyExtractor={(item, index) => item.id}
        onEndReached={this.props.fetchMorePosts}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent} />
    </View>
  }
}

export const filterOptions = [
  {id: null, label: 'All Posts'},
  {id: 'discussion', label: 'Discussions'},
  {id: 'request', label: 'Requests'},
  {id: 'offer', label: 'Offers'}
]

const sortOptions = [
  {id: 'updated', label: 'Latest'},
  {id: 'votes', label: 'Popular'}
]

const optionText = (id, options) => {
  const option = find(o => o.id === id, options) || options[0]
  return option.label
}

export function ListControls ({ filter: listFilter, sortBy, setFilter, setSort }) {
  return <View style={styles.listControls}>
    <ListControl selected={listFilter} onChange={setFilter} options={filterOptions} />
    <ListControl selected={sortBy} onChange={setSort} options={sortOptions} />
  </View>
}

export function ListControl ({ selected, options, onChange }) {
  const actions = options.map(option => [
    option.label,
    () => onChange(option.id)
  ])

  return <PopupMenuButton
    actions={actions}
    style={styles.listControl}>
    <Text style={styles.optionText}>{optionText(selected, options)}</Text>
    <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
  </PopupMenuButton>
}

export function PostRow ({
  post, showPost, showMember, showTopic,
  showCommunity, goToCommunity, selectedNetworkId
}) {
  // TODO: Move to Post model instance method...
  // When a network is selected only show communities
  // in the that network in the header
  var filteredPost = post
  if (selectedNetworkId) {
    filteredPost = {
      ...post,
      communities: filter(
        community => get('network.id', community) === selectedNetworkId,
        post.communities
      )
    }
  }
  return <View style={styles.postRow}>
    <TouchableOpacity delayPressIn={50} activeOpacity={0.6} onPress={() => showPost(post.id)}>
      <View>
        <PostCard post={filteredPost}
          showMember={showMember}
          showTopic={showTopic}
          showCommunity={showCommunity}
          goToCommunity={goToCommunity} />
      </View>
    </TouchableOpacity>
  </View>
}
