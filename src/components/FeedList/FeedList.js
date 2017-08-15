import React, { Component } from 'react'
import { FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import styles from './FeedList.styles'
import PostCard from '../PostCard'
import Loading from '../Loading'
import Icon from '../Icon'
import { find, get, isEmpty } from 'lodash/fp'

import ImagePicker from '../ImagePicker'

export default class FeedList extends Component {
  fetchOrShowCached () {
    const { hasMore, posts, fetchPosts } = this.props
    if (isEmpty(posts) && hasMore !== false) fetchPosts()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter ||
        get('id', prevProps.community) !== get('id', this.props.community)) {
      this.fetchOrShowCached()
    }
  }

  render () {
    const {
      posts,
      fetchMorePosts,
      filter,
      sortBy,
      setFilter,
      setSort,
      pending,
      header,
      showPost,
      editPost,
      showMember,
      showTopic
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
      {pending && <Loading />}
    </View>

    return <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) =>
          <PostRow
            post={item}
            showPost={showPost}
            editPost={editPost}
            showMember={showMember}
            showTopic={showTopic} />}
        keyExtractor={(item, index) => item.id}
        onEndReached={fetchMorePosts}
        ListHeaderComponent={listHeaderComponent}
        />
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
    <ListControl selected={filter} onChange={() => setFilter('request')} options={filterOptions} />
    <ListControl selected={sortBy} onChange={() => setSort('votes')} options={sortOptions} />
  </View>
}

export function ListControl ({ selected, options, onChange }) {
  // TODO: onPress should open a platform specific dropdown/sheet, which
  // calls onChange
  return <TouchableOpacity style={styles.listControl} onPress={onChange}>
    <Text style={styles.optionText}>{optionText(selected, options)}</Text>
    <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
  </TouchableOpacity>
}

export function PostRow ({ post, showPost, editPost, showMember, showTopic }) {
  return <View style={styles.postRow}>
    <TouchableWithoutFeedback onPress={() => showPost(post.id)}>
      <View>
        <PostCard
          post={post}
          editPost={() => editPost(post.id)}
          showMember={showMember}
          showTopic={showTopic} />
      </View>
    </TouchableWithoutFeedback>
  </View>
}
