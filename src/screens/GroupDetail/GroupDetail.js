import React, { useEffect, useState } from 'react'
import { Image, Text, ScrollView, View, ImageBackground, TextInput } from 'react-native'
import { accessibilityDescription, GROUP_VISIBILITY, GROUP_ACCESSIBILITY } from 'store/models/Group'
import Button from 'components/Button'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'
import styles from './GroupDetail.styles'
import Loading from 'components/Loading'

export default function GroupDetail ({
  loading, group, alreadyRequested,
  navigation, fetchGroupJoinSettings,
  createJoinRequest
}) {
  useEffect(() => { fetchGroupJoinSettings(group.id) }, [])

  const [questionAnswers, setAnswer] = useState({})

  const setQuestionAnswer = questionId => answer => {
    setAnswer(currentAnswers => ({ ...currentAnswers, [questionId]: answer }))
  }

  const join = () => {
    const answers = []
    questionAnswers.forEach((questionId, answer) =>
      answers.append({ questionId, answer }))
    createJoinRequest(group.id, answers)
    navigation.navigate('Group Relationships')
  }

  const canJoin = !alreadyRequested &&
    [GROUP_ACCESSIBILITY.Open, GROUP_ACCESSIBILITY.Restricted].includes(group.accessibility)
  const askJoinQuestions = group.settings.askJoinQuestions
  const joinQuestions = canJoin && askJoinQuestions
    ? group.joinQuestions.toRefArray()
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
        {!canJoin && !alreadyRequested && (
          <Text>{accessibilityDescription(group.accessibility)}</Text>
        )}
        {canJoin && joinQuestions.length > 0 && (
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
        {canJoin && <Button style={styles.joinButton} onPress={join} text='Join' />}
        {alreadyRequested && (
          <Text>Your request to join this group is pending moderator approval.</Text>
        )}
      </View>
    </ScrollView>
  )
}
