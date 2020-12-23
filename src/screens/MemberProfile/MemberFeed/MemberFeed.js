import React, { useEffect } from 'react'
import { Text, View, TouchableOpacity, FlatList } from 'react-native'
import PostCard from 'components/PostCard'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './MemberFeed.styles'

const feedOptions = [
  'Posts', 'Comments', 'Upvotes'
]

export default function MemberFeed ({
  id,
  items,
  itemType,
  choice,
  setChoice,
  header,
  fetchItems,
  fetchMoreItems,
  pending,
  showPost,
  showTopic,
  showMember,
  goToCommunity
}) {
  useEffect(() => { fetchItems() }, [ id, choice ])

  const listHeaderComponent = (
    <View>
      {header}
      <View style={styles.feedTabs}>
        {feedOptions.map(option =>
          <FeedTab
            key={option}
            option={option}
            chosen={option === choice}
            onPress={() => setChoice(option)}
          />)}
      </View>
    </View>
  )

  const listFooterComponent = (
    <View style={styles.footer}>
      {pending && <Loading />}
    </View>
  )

  return (
    <View style={styles.superContainer}>
      <FlatList
        data={items}
        renderItem={({ item }) =>
          <ContentRow
            item={item}
            itemType={itemType}
            showPost={showPost}
            showTopic={showTopic}
            showMember={showMember}
            goToCommunity={goToCommunity} />}
        keyExtractor={item => item.id}
        onEndReached={fetchMoreItems}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        contentContainerStyle={styles.container}
      />
    </View>
  )
}

export function ContentRow ({ item, itemType, showPost, showTopic, showMember, goToCommunity }) {
  let content, postId
  if (itemType === 'post') {
    postId = item.id
    content = (
      <PostCard
        goToCommunity={goToCommunity}
        shouldShowCommunities={true}
        showMember={showMember}
        showTopic={showTopic}
        post={item}
        creator={item.creator}
        commenters={item.commenters}
        communities={item.communities}
        topics={item.topics}
      />
    )
  } else {
    postId = item.post.id
    content = <Comment comment={item} displayPostTitle />
  }
  return (
    <TouchableOpacity onPress={() => showPost(postId)}>
      <View style={styles.contentRow}>
        {content}
      </View>
    </TouchableOpacity>
  )
}

export function FeedTab ({ option, chosen, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={chosen ? styles.chosenOption : styles.option}>{option}</Text>
    </TouchableOpacity>
  )
}
