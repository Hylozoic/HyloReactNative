import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Image, Text, View, ImageBackground, TextInput } from 'react-native'
import getGroup from 'store/selectors/getGroup'
import { accessibilityDescription, GROUP_VISIBILITY, GROUP_ACCESSIBILITY } from 'store/models/Group'
import Button from 'components/Button'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'
import styles from './GroupDetail.styles'
// Store stuff
import useAsyncAction from 'util/useAsyncAction'
import {
  JOIN_GROUP, CREATE_JOIN_REQUEST,  FETCH_GROUP_JOIN_QUESTIONS
} from 'store/constants'
import Loading from 'components/Loading'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'

export default function GroupDetail ({ route, navigation }) {
  const dispatch = useDispatch()
  const groupId = route.params.groupId
  const group = useSelector(state => getGroup(state, { id: groupId }))
  const joinRequests = useSelector(getMyJoinRequests)
  const alreadyRequested = joinRequests.find(r => r.group.id === groupId)
  const askJoinQuestions = group.settings.askJoinQuestions
  // !alreadyRequested && askJoinQuestions && 

  const [load, loading] = useAsyncAction(() => fetchGroupJoinQuestions(groupId), [groupId])
  useEffect(() => { load() }, [])

  const joinQuestion = group.joinQuestions.toRefArray()
  const [questionAnswers, setQuestionAnswers] = useState(
    joinQuestion.map(({ questionId, text }) => ({ questionId, text, answer: '' }))
  )

  if (loading) return <Loading />

  const setAnswer = index => answerValue => {
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [ ...prevAnswers ]
      newAnswers[index].answer = answerValue
      return newAnswers
    })
  }

  const join = () => {
    const answers = questionAnswers.map(({ questionId, answer }) => ({ questionId, answer }))
    dispatch(createJoinRequest(groupId, answers))
    navigation.navigate('Group Relationships')
  }

  const canJoin = !alreadyRequested && [GROUP_ACCESSIBILITY.Open, GROUP_ACCESSIBILITY.Restricted]
    .includes(group.accessibility)

  const groupBannerImage = group.bannerUrl ? { uri: group.bannerUrl } : null

  return (
    <View style={styles.container}>
      <ImageBackground source={groupBannerImage} style={styles.headerBackgroundImage}>
        <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
        <View style={styles.headerContent}>
          <Image source={{ uri: group.avatarUrl }} style={styles.headerAvatar} />
          <Text style={styles.headerText}>{group.name}</Text>
        </View>  
      </ImageBackground>
      <View style={styles.mainContent}>
        <Text style={styles.groupDescription}>{group.description}</Text>
        {!canJoin && !alreadyRequested && (
          <Text>{accessibilityDescription(group.accessibility)}</Text>
        )}
        {canJoin && askJoinQuestions && questionAnswers.map((question, index) => (
          <View key={index}>
            <Text style={{ fontSize: 40 }}>{question.text}</Text>
            <TextInput onChangeText={setAnswer(index)} />
          </View>
        ))}
        {canJoin && <Button onPress={join} text='Join' />}
        {alreadyRequested && (
          <Text>Your request to join this group is pending moderator approval.</Text>
        )}
      </View>
    </View>
  )
}

export function joinGroup (groupId) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: `mutation ($groupId: ID) {
        joinGroup(groupId: $groupId) {
          id
          role
          hasModeratorRole
          group {
            id
            name
            slug
          }
          person {
            id
          }
        }
      }`,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Membership',
      groupId,
      optimistic: true
    }
  }
}

export function createJoinRequest (groupId, questionAnswers) {
  return {
    type: CREATE_JOIN_REQUEST,
    graphql: {
      query: `mutation ($groupId: ID, $questionAnswers: [QuestionAnswerInput]) {
        createJoinRequest(groupId: $groupId, questionAnswers: $questionAnswers) {
          request {
            id
            user {
              id
            }
            group {
              id
            }
            createdAt
            updatedAt
            status
          }
        }
      }`,
      variables: { groupId, questionAnswers }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}

export function fetchGroupJoinQuestions (groupId) {
  return {
    type: FETCH_GROUP_JOIN_QUESTIONS,
    graphql: {
      query: `
        query ($groupId: ID) {
          group (id: $groupId) {
            id
            joinQuestions {
              items {
                id
                questionId
                text
              }
            }
          }
        }
      `,
      variables: {
        groupId
      }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Group'
    }
  }
}
