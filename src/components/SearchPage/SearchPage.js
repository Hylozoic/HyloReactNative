import React from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Loading from '../Loading'
import Avatar from '../Avatar'
import styles from './SearchPage.styles'
import header from 'util/header'
import Icon from '../Icon'
import UnwrappedPostCard from '../PostCard'
import PostHeader from '../PostCard/PostHeader'
import { PostTitle } from '../PostCard/PostBody/PostBody'
import UnwrappedCommentCard from '../Comment'

export default class SearchPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Search',
      options: {
        headerBackTitle: null
      }
    })
  }

  state = {
    refreshing: false
  }

  componentDidMount () {
    this.props.fetchSearchResults()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm ||
      prevProps.filter !== this.props.filter) {
      this.props.fetchSearchResults()
    }
    if (prevProps.pending && !this.props.pending) {
      this.setState({
        refreshing: false
      })
    }
  }

  fetchMore = () => {
    const { pending } = this.props
    if (pending) return null
    this.props.fetchMoreSearchResults()
  }

  onRefresh = () => {
    const { refreshing } = this.state
    if (refreshing) return null
    this.setState({refreshing: true})
    this.props.fetchSearchResults()
  }

  render () {
    const {
      searchResults, searchTerm, setSearchTerm, pending, goToPost, goToPerson,
      filter, setSearchFilter
    } = this.props
    const { refreshing } = this.state

    const listHeaderComponent = <View>
      <View style={styles.searchBar}>
        <View style={styles.searchBox}>
          <Icon name='Search' style={styles.searchIcon} />
          <TextInput
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            style={styles.textInput}
            underlineColorAndroid='transparent' />
        </View>
      </View>
      {/* <TabBar filter={filter} setSearchFilter={setSearchFilter} /> */}
    </View>

    const listFooterComponent = pending
      ? <Loading style={styles.loading} />
      : null

    return <SafeAreaView style={styles.flatListContainer}>
      <FlatList
        data={searchResults}
        renderItem={({ item }) =>
          <SearchResult
            searchResult={item}
            goToPost={goToPost}
            goToPerson={goToPerson} />}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id}
        onEndReached={() => this.fetchMore()}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent} />
    </SafeAreaView>
  }
}

const tabs = [
  {id: 'all', label: 'All'},
  {id: 'post', label: 'Discussions'},
  {id: 'person', label: 'People'},
  {id: 'comment', label: 'Comments'}
]

export function TabBar ({ filter, setSearchFilter }) {
  return <View style={styles.tabBar}>
    {tabs.map(({ id, label }) => <Tab
      key={id}
      id={id}
      label={label}
      filter={filter}
      setSearchFilter={setSearchFilter} />)}
  </View>
}

export function Tab ({ id, label, filter, setSearchFilter }) {
  return <TouchableOpacity
    onPress={() => setSearchFilter(id)}
    hitSlop={{top: 10, bottom: 15, left: 15, right: 15}}>
    <Text style={[styles.tab, (filter === id) && styles.active]}>{label}</Text>
  </TouchableOpacity>
}

export function SearchResult ({ searchResult, goToPost, goToPerson }) {
  const { type, content } = searchResult

  var component
  switch (type) {
    case 'Person':
      component = <PersonCard person={content} goToPerson={goToPerson} />
      break
    case 'Post':
      component = <PostCard
        post={content}
        goToPost={goToPost} />
      break
    case 'Comment':
      component = <CommentCard comment={content} expanded={false} goToPost={goToPost} />
      break
  }
  return <View style={styles.searchResult}>
    {component}
  </View>
}

export function PersonCard ({ person, goToPerson }) {
  const { id, avatarUrl, name, location } = person
  return <TouchableOpacity onPress={() => goToPerson(id)}>
    <View style={styles.personCard}>
      <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
      <View style={styles.nameAndLocation}>
        <Text style={styles.name}>{name}</Text>
        {location.length > 0 && <Text style={styles.location}>{location}</Text>}
      </View>
    </View>
  </TouchableOpacity>
}

export function PostCard ({ post, goToPost }) {
  const goToThisPost = () => goToPost(post.id)
  const { creator, communities } = post
  return <TouchableOpacity onPress={goToThisPost} style={styles.postWrapper}>
    <UnwrappedPostCard
      creator={creator}
      showDetails={goToThisPost}
      showMember={goToThisPost}
      goToCommunity={goToThisPost}
      post={post}
      communities={communities}
      hideMenu
      hideDetails
      shouldShowCommunities />
  </TouchableOpacity>
}

export function CommentCard ({ comment, goToPost }) {
  const { post } = comment
  const goToThisPost = () => goToPost(post.id)

  return <TouchableOpacity onPress={goToThisPost} style={styles.commentWrapper}>
    <View style={styles.commentPostHeader}>
      <PostHeader creator={post.creator}
        date={post.createdAt}
        type={post.type}
        pinned={post.pinned}
        postId={post.id}
        showMember={goToThisPost}
        showTopic={goToThisPost}
        goToCommunity={goToThisPost}
        announcement={post.announcement}
        hideMenu
        smallAvatar />
      <PostTitle title={post.title} style={styles.postTitle} />
    </View>
    <View style={styles.commentDivider} />
    <UnwrappedCommentCard
      comment={comment}
      showMember={goToThisPost}
      showTopic={goToThisPost} />
  </TouchableOpacity>
}
