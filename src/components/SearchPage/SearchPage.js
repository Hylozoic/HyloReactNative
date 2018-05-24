import React from 'react'
import { View, ScrollView, Text, TextInput, FlatList } from 'react-native'
import Loading from '../Loading'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import styles from './SearchPage.styles'
import header from 'util/header'
import Icon from '../Icon'

export default class SearchPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Search',
      options: {
        headerBackTitle: null
      }
    })
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
  return <View>
    <Text>
      This is a person named: {person.name}
    </Text>
  </View>
}

export function PostCard ({ post }) {
  return <View>
    <Text>
      This is a post titled: {post.title}
    </Text>
  </View>
}

export function CommentCard ({ comment }) {
  return <View>
    <Text>
      This is a comment: {comment.text}, on post: {comment.post.title}, by {comment.creator.name}
    </Text>
  </View>
}
