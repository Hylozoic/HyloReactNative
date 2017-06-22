import React, { Component } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from './FeedList.styles'
import PostCard from '../PostCard'
import Icon from '../Icon'
import Post from '../Post'
import { find } from 'lodash/fp'

export default class FeedList extends Component {

  componentDidMount () {
    this.props.fetchPosts()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter) {
      this.props.fetchPosts()
    }
  }

  render () {
    const { posts, fetchMorePosts, filter, sortBy, setFilter, setSort } = this.props
    return <View style={styles.container}>
      <ListControls
        filter={filter}
        sortBy={sortBy}
        setFilter={setFilter}
        setSort={setSort}
        />
      <FlatList
        style={styles.list}
        data={posts}
        renderItem={({ item }) => <PostRow post={item} />}
        keyExtractor={(item, index) => item.id}
        onEndReached={fetchMorePosts}
        />
    </View>
  }
}

const filterOptions = [
  {id: 'all', label: 'All Posts'},
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
    <ListControl selected={filter} onPress={() => setFilter('request')} options={filterOptions} />
    <ListControl selected={sortBy} onPress={() => setSort('updated')} options={sortOptions} />
  </View>
}

export function ListControl ({ selected, options, onPress }) {
  return <TouchableOpacity style={styles.listControl} onPress={onPress}>
    <Text style={styles.optionText}>{optionText(selected, options)}</Text>
    <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
  </TouchableOpacity>
}

export function PostRow ({ post }, { navigate }) {
  const showPost = () =>
    navigate({title: 'Post', component: Post, props: {post}})

  return <View style={styles.postRow}>
    <TouchableOpacity onPress={showPost}>
      <PostCard post={post} />
    </TouchableOpacity>
  </View>
}
PostRow.contextTypes = {navigate: React.PropTypes.func}
