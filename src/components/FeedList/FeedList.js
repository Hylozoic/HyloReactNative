import React, { Component } from 'react'
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native'
import styles from './FeedList.styles'
import PostCard from '../PostCard'
import Loading from '../Loading'
import Icon from '../Icon'
import PopupMenuButton from '../PopupMenuButton'
import { find, get, isEmpty } from 'lodash/fp'

export default class FeedList extends Component {
  fetchOrShowCached () {
    const { hasMore, posts, fetchPosts, pending } = this.props
    if (isEmpty(posts) && hasMore !== false && !pending) fetchPosts()
  }

  componentDidMount () {
    this.fetchOrShowCached()
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
        get('id', prevProps.community) !== get('id', this.props.community)) {
      this.fetchOrShowCached()
    }
  }

  render () {
    const {
      posts,
      filter,
      sortBy,
      setFilter,
      setSort,
      pending,
      header,
      showPost,
      editPost,
      showMember,
      showTopic,
      showCommunities,
      goToCommunity
    } = this.props

    const listHeaderComponent = <View>
      {header}
      <ListControls
        filter={filter}
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
            editPost={editPost}
            showMember={showMember}
            showTopic={showTopic}
            showCommunity={showCommunities}
            goToCommunity={goToCommunity} />}
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

export function ListControls ({ filter, sortBy, setFilter, setSort }) {
  return <View style={styles.listControls}>
    <ListControl selected={filter} onChange={setFilter} options={filterOptions} />
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
  post, showPost, editPost, showMember, showTopic, showCommunity, goToCommunity
}) {
  return <View style={styles.postRow}>
    <TouchableWithoutFeedback onPress={() => showPost(post.id)}>
      <View>
        <PostCard
          post={post}
          editPost={() => editPost(post.id)}
          showMember={showMember}
          showTopic={showTopic}
          showCommunity={showCommunity}
          goToCommunity={goToCommunity} />
      </View>
    </TouchableWithoutFeedback>
  </View>
}
