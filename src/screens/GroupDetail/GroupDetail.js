import React, { useEffect, useState } from 'react'
import { Text, ScrollView, View, TouchableOpacity, TextInput } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'
import { isModalScreen } from 'navigation/linking/helpers'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import fetchGroupDetailsAction from 'store/actions/fetchGroupDetails'
import createJoinRequestAction from 'store/actions/createJoinRequest'
import joinRequestAction from 'store/actions/joinGroup'
import getGroup from 'store/selectors/getGroup'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import getMemberships from 'store/selectors/getMemberships'
import presentGroup from 'store/presenters/presentGroup'
import Loading from 'components/Loading'
import Button from 'components/Button'
import { GroupRow } from 'screens/Groups/Groups'
import styles from './GroupDetail.styles'

/* DEPRECATED: Replaced by WebView `GroupExplorWebView` */
export default function GroupDetail ({ navigation, route }) {
  const dispatch = useDispatch()
  const isModal = isModalScreen(route?.name)
  const groupSlug = route.params.groupSlug
  const group = useSelector(state => presentGroup(getGroup(state, { slug: groupSlug })))
  const hasPendingRequest = useSelector(getMyJoinRequests).find(joinRequest => joinRequest.group.slug === groupSlug)
  const myMemberships = useSelector(getMemberships)
  const [isMember, setIsMember] = useState()
  const [loading, setLoading] = useState(true)
  const [questionAnswers, setAnswer] = useState({})

  useEffect(() => {
    const asyncFunc = async () => {
      setLoading(true)
      await dispatch(fetchGroupDetailsAction({ slug: groupSlug }))
      setLoading(false)
    }
    asyncFunc()
    setIsMember(myMemberships.find(m => m.group.slug === groupSlug))
  }, [groupSlug])

  if (loading) return <Loading />

  const setQuestionAnswer = questionId => answer => {
    setAnswer(currentAnswers => ({ ...currentAnswers, [questionId]: answer }))
  }

  const joinGroup = async () => {
    const answers = []
    for (const questionId in questionAnswers) {
      answers.push({ questionId: parseInt(questionId), answer: questionAnswers[questionId] })
    }
    setLoading(true)
    await dispatch(joinRequestAction(group.id))
    navigation.navigate(isModal ? 'Map' : 'Feed', { groupSlug: group.slug })
    setLoading(false)
  }

  const createJoinRequest = async () => {
    const answers = []
    for (const questionId in questionAnswers) {
      answers.push({ questionId: parseInt(questionId), answer: questionAnswers[questionId] })
    }
    setLoading(true)
    await dispatch(createJoinRequestAction(group.id, answers))
    setLoading(false)
  }

  const goToGroupExplore = group => navigation.navigate('Group Detail', { groupSlug: group?.slug })

  const goToGroup = group => navigation.navigate(isModal ? 'Map' : 'Feed', { groupSlug: group?.slug })

  const canJoin = !hasPendingRequest &&
    [GROUP_ACCESSIBILITY.Open, GROUP_ACCESSIBILITY.Restricted].includes(group.accessibility)
  const joinQuestions = canJoin && group.settings?.askJoinQuestions
    ? group.joinQuestions
    : []
  const groupBannerImage = group.bannerUrl ? { uri: group.bannerUrl } : null

  return (
    <ScrollView style={styles.container}>
      <FastImage style={styles.headerBackgroundImage} source={groupBannerImage}>
        <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
        <View style={styles.headerContent}>
          <FastImage style={styles.headerAvatar} source={{ uri: group.avatarUrl }} />
          <Text style={styles.headerText}>{group.name}</Text>
        </View>  
      </FastImage>
      <View style={styles.mainContent}>
        <Text style={styles.groupDescription}>{group.description}</Text>
        {isMember && <>
          <Button style={styles.joinButton} onPress={() => goToGroup(group)} text={`Go to ${group.name} now`} />
        </>}
        {!isMember && (group.prerequisiteGroups?.length > 0
          ? (
            <View style={styles.prerequisiteGroups}>
              <Text>{group.name} is only accessible to members of the following group(s). To join {group.name} visit each of the groups below and become a member:</Text>
              {group.prerequisiteGroups.map((prereqGroup, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => goToGroupExplore(prereqGroup)}>
                    <GroupRow key={prereqGroup.id} group={prereqGroup} goToGroupExplore={goToGroupExplore} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : group.numPrerequisitesLeft
            ? (
              <Text>This group has prerequisite groups you cannot see, you cannot join this group at this time</Text>
            ) : group.accessibility === GROUP_ACCESSIBILITY.Open
              ? (
                <View style={styles.requestOption}>
                  <Text style={styles.accessibilityMessage}>Anyone can join this group!</Text>
                  <JoinQuestionsAndButton joinQuestions={joinQuestions} setQuestionAnswer={setQuestionAnswer}
                      joinButtonOnPress={joinGroup} joinButtonText='Join' />
                </View>
              ) : group.accessibility === GROUP_ACCESSIBILITY.Restricted
                  ? hasPendingRequest
                    ? (
                      <Text style={styles.joinStatusBox}>Request to join pending</Text>
                    ) : (
                      <JoinQuestionsAndButton joinQuestions={joinQuestions} setQuestionAnswer={setQuestionAnswer}
                        joinButtonOnPress={createJoinRequest} joinButtonText='Request Membership' />
                  ) : (
                    <Text style={styles.joinStatusBox}> {/* Closed group */}
                      This is group is invitation only
                    </Text>
                  )
        )}
      </View>
    </ScrollView>
  )
}

export function JoinQuestionsAndButton ({ joinQuestions, setQuestionAnswer,  joinButtonOnPress, joinButtonText }) {
  return (
    <View style={styles.requestOption}>
      {joinQuestions.length > 0 && (
        <View style={styles.joinQuestions}>
          {joinQuestions.map((question, index) => (
            <View style={styles.joinQuestion} key={index}>
              <Text style={styles.joinQuestionText}>{question.text}</Text>
              <TextInput style={styles.joinQuestionAnswerInput}
                multiline={true}
                onChangeText={setQuestionAnswer(question.questionId)} />
            </View>
          ))}
        </View>
      )}
      <Button style={styles.joinButton} onPress={joinButtonOnPress} text={joinButtonText} />
    </View>
  )
}