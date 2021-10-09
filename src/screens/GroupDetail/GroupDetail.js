import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import fetchGroupDetailsAction from 'store/actions/fetchGroupDetails'
import createJoinRequestAction from 'store/actions/createJoinRequest'
import joinRequestAction from 'store/actions/joinGroup'
import getGroup from 'store/selectors/getGroup'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import isPendingFor from 'store/selectors/isPendingFor'
import {
  JOIN_GROUP, CREATE_JOIN_REQUEST, FETCH_GROUP_DETAILS
} from 'store/constants'
import presentGroup from 'store/presenters/presentGroup'

import { Image, Text, ScrollView, View, ImageBackground, TouchableOpacity, TextInput } from 'react-native'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import Loading from 'components/Loading'
import Button from 'components/Button'
import { GroupRow } from 'screens/Groups/Groups'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'
import styles from './GroupDetail.styles'
import getMemberships from 'store/selectors/getMemberships'

export default function GroupDetail ({ navigation, route }) {
  const dispatch = useDispatch()
  const groupId = route.params.groupId
  const myMemberships = useSelector(getMemberships)
  
  useEffect(() => { dispatch(fetchGroupDetailsAction(groupId)) }, [groupId])

  const loading = useSelector(state => isPendingFor([JOIN_GROUP, CREATE_JOIN_REQUEST,  FETCH_GROUP_DETAILS], state))
  const group = useSelector(state => presentGroup(getGroup(state, { id: groupId })))
  const isMember = myMemberships.find(m => m.group.id === group?.id)
  const hasPendingRequest = useSelector(getMyJoinRequests).find(r => r.group.id === groupId)
  const [questionAnswers, setAnswer] = useState({})

  const setQuestionAnswer = questionId => answer => {
    setAnswer(currentAnswers => ({ ...currentAnswers, [questionId]: answer }))
  }

  const joinGroup = async () => {
    const answers = []
    for (const questionId in questionAnswers) {
      answers.push({ questionId: parseInt(questionId), answer: questionAnswers[questionId] })
    }
    await dispatch(joinRequestAction(group.id))
    // await dispatch(fetchGroupDetailsAction(group.id))
  }

  const createJoinRequest = async () => {
    const answers = []
    for (const questionId in questionAnswers) {
      answers.push({ questionId: parseInt(questionId), answer: questionAnswers[questionId] })
    }
    await dispatch(createJoinRequestAction(group.id, answers))
    // await dispatch(fetchGroupDetailsAction(group.id))
  }

  const goToGroupDetail = group => {
    navigation.navigate('Group Detail', { groupId: group?.id })
  }

  const canJoin = !hasPendingRequest &&
    [GROUP_ACCESSIBILITY.Open, GROUP_ACCESSIBILITY.Restricted].includes(group.accessibility)

  const joinQuestions = canJoin && group.settings?.askJoinQuestions
    ? group.joinQuestions
    : []
  const groupBannerImage = group.bannerUrl ? { uri: group.bannerUrl } : null

  if (loading) return <Loading />

  return (
    <ScrollView style={styles.container}>
      <ImageBackground style={styles.headerBackgroundImage} source={groupBannerImage}>
        <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
        <View style={styles.headerContent}>
          <Image style={styles.headerAvatar} source={{ uri: group.avatarUrl }} />
          <Text style={styles.headerText}>{group.name}</Text>
        </View>  
      </ImageBackground>
      <View style={styles.mainContent}>
        <Text style={styles.groupDescription}>{group.description}</Text>
        {isMember && (
          <Text style={styles.joinStatusBox}>You are a member</Text>
        )}
        {!isMember && (group.prerequisiteGroups?.length > 0
          ? (
            <View style={styles.prerequisiteGroups}>
              <Text>{group.name} is only accessible to members of the following group(s). To join {group.name} visit each of the groups below and become a member:</Text>
              {group.prerequisiteGroups.map((prereqGroup, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => goToGroupDetail(prereqGroup)}>
                    <GroupRow key={prereqGroup.id} group={prereqGroup} goToGroupDetail={goToGroupDetail} />
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