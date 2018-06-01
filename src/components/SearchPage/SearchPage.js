import React from 'react'
import { View, ScrollView, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import Avatar from '../Avatar'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
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

  componentDidMount () {
    this.props.fetchSearchResults()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm ||
      prevProps.filter !== this.props.filter) {
      this.props.fetchSearchResults()
    }
  }

  render () {
    const { searchResults, searchTerm, setSearchTerm, pending } = this.props

    const listHeaderComponent = <View>
      <View style={styles.searchBar}>
        <View style={styles.searchBox}>
          <Icon name='Search' style={styles.searchIcon} />
          <TextInput
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            style={styles.textInput}
            underlineColorAndroid={styles.androidInvisibleUnderline} />
        </View>
      </View>
    </View>
    const listFooterComponent = pending
      ? <Loading style={styles.loading} />
      : null

    const goToPost = id => console.log('goToPost', id)
    const goToPerson = id => console.log('goToPerson', id)

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardFriendlyView>
        <FlatList
          data={searchResults}
          renderItem={({ item }) =>
            <SearchResult
              searchResult={item}
              goToPost={goToPost}
              goToPerson={goToPerson} />}
          onRefresh={this.props.fetchMoreSearchResults}
          refreshing={pending}
          keyExtractor={(item) => item.id}
          onEndReached={this.props.fetchMoreSearchResults}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent} />
      </KeyboardFriendlyView>
    </ScrollView>
  }
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
        styleName='postcard-expand'
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

export function PersonCard ({ person }) {
  const { avatarUrl, name, location } = person
  return <View style={styles.personCard}>
    <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
    <View style={styles.nameAndLocation}>
      <Text style={styles.name}>{name}</Text>
      {location && <Text style={styles.location}>{location}</Text>}
    </View>
  </View>
}

export function PostCard ({ post, goToPost }) {
  const goToThisPost = () => goToPost(post.id)
  const { creator } = post
  return <TouchableOpacity onPress={goToThisPost}>
    <View style={styles.postWrapper}>
      <UnwrappedPostCard
        creator={creator}
        showDetails={goToThisPost}
        showMember={goToThisPost}
        goToCommunity={goToThisPost}
        post={post}
        hideMenu
        hideDetails />
    </View>
  </TouchableOpacity>
}

export function CommentCard ({ comment, goToPost }) {
  const { post } = comment
  const goToThisPost = () => goToPost(post.id)

  return <View style={styles.commentWrapper}>
    <View style={styles.commentPostHeader}>
      <PostHeader creator={post.creator}
        date={post.createdAt}
        type={post.type}
        topics={post.topics}
        communities={post.communities}
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
  </View>
}
