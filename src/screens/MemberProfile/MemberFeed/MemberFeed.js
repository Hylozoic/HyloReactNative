import React, { useEffect } from 'react'
import { Text, View, TouchableOpacity, FlatList } from 'react-native'
import PostCard from 'components/PostCard'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './MemberFeed.styles'
import useChangeToGroup from 'hooks/useChangeToGroup'

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
  showMember
}) {
  useEffect(() => { fetchItems() }, [id, choice])

  const changeToGroup = useChangeToGroup()

  return (
    <View style={styles.superContainer}>
      <FlatList
        contentContainerStyle={styles.container}
        data={items}
        keyExtractor={item => item.id}
        ListFooterComponent={<FooterComponent pending={pending} />}
        ListHeaderComponent={<HeaderComponent header={header} setChoice={setChoice} choice={choice} />}
        onEndReached={fetchMoreItems}
        renderItem={({ item }) => (
          <ContentRow
            item={item}
            itemType={itemType}
            showPost={showPost}
            showTopic={showTopic}
            showMember={showMember}
            goToGroup={changeToGroup}
          />
        )}
      />
    </View>
  )
}

export const HeaderComponent = ({
  choice,
  header,
  setChoice
}) => {
  const feedOptions = ['Posts', 'Comments', 'Upvotes']

  return (
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
}

export function FooterComponent ({ pending }) {
  return (
    <View style={styles.footer}>
      {pending && <Loading />}
    </View>
  )
}

export function ContentRow ({
  item,
  itemType,
  showPost: providedShowPost,
  showTopic,
  showMember,
  goToGroup,
  respondToEvent
}) {
  const showPost = () => providedShowPost(itemType === 'post' ? item.id : item.post.id)

  return (
    <TouchableOpacity onPress={showPost}>
      <View style={styles.contentRow}>
        {itemType === 'post' && (
          <PostCard
            goToGroup={goToGroup}
            showGroups
            showMember={showMember}
            showTopic={showTopic}
            onPress={showPost}
            post={item}
            respondToEvent={response => respondToEvent(item.id, response)}
            creator={item.creator}
            commenters={item.commenters}
            groups={item.groups}
            topics={item.topics}
          />
        )}
        {itemType !== 'post' && (
          <Comment
            onPress={showPost}
            comment={item}
            displayPostTitle
          />
        )}
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
