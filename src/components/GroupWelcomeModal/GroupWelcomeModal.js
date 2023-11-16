import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import FastImage from 'react-native-fast-image'
import { Alert, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CheckBox from 'react-native-bouncy-checkbox'
import { ScrollView } from 'react-native-gesture-handler'
import ScrollableModal from 'components/ScrollableModal'
import updateMembershipSettings from 'store/actions/updateMembershipSettings'
import { addSkill as addSkillAction, removeSkill as removeSkillAction } from 'store/actions/skills'
import { ALL_GROUP, DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import presentGroup from 'store/presenters/presentGroup'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroup from 'store/selectors/getGroup'
import getMe from 'store/selectors/getMe'
import { caribbeanGreen, rhino } from 'style/colors'
import Pill from 'components/Pill'
import { useNavigation } from '@react-navigation/native'

export default function GroupWelcomeModal ({ groupId }) {
  const dispatch = useDispatch()
  const currentMemberships = useSelector(state => getMyMemberships(state))
  const currentUser = useSelector(getMe)
  const currentGroup = useSelector(state => getGroup(state, { id: groupId }))
  const navigation = useNavigation()
  const membership = currentMemberships.find(m => m.group.id === groupId)
  const showJoinForm = membership?.settings?.showJoinForm
  const group = presentGroup(currentGroup)
  const addSkill = name => dispatch(addSkillAction(name))
  const removeSkill = skillId => dispatch(removeSkillAction(skillId))

  const { name, avatarUrl, purpose, bannerUrl, agreements, suggestedSkills } = group
  const imageSource = { uri: avatarUrl || DEFAULT_AVATAR }
  const bgImageSource = { uri: bannerUrl || DEFAULT_BANNER }

  const numAgreements = group.agreements?.length || 0
  const [acceptedAgreements, setAcceptedAgreements] = useState(Array(numAgreements).fill(false))
  const numAcceptedAgreements = acceptedAgreements.reduce((count, agreement) => count + (agreement ? 1 : 0), 0)
  const acceptedAllAgreements = numAcceptedAgreements === numAgreements

  useEffect(() => {
    if (numAgreements > 0) {
      setAcceptedAgreements(group.agreements.map(a => a.accepted))
    }
  }, [group?.id])

  const handleCheckAgreement = ({ checked, index }) => {
    const accepted = checked
    const agreementIndex = index
    const newAgreements = [...acceptedAgreements]
    newAgreements[agreementIndex] = accepted
    setAcceptedAgreements(newAgreements)
  }

  const handleCheckAllAgreements = e => {
    const accepted = !acceptedAllAgreements
    const newAgreements = Array(numAgreements).fill(accepted)
    setAcceptedAgreements(newAgreements)
  }

  const handleClose = async () => {
    if (numAgreements > 0 && !acceptedAllAgreements) {
      Alert.alert(
        'Are you sure?',
        'To view the group contents, you have to adhere to the group agreements',
        [
          {
            text: 'Ok, I understand',
            onPress: () => {} // noop that closes alert
          },
          {
            text: 'Return Home',
            onPress: () => {
              navigation.navigate('Group Navigation', { groupSlug: ALL_GROUP.slug })
              navigation.navigate('Feed', { initial: false })
            }
          }
        ],
        { cancelable: false }
      )
    } else {
      await dispatch(updateMembershipSettings(currentGroup.id, { showJoinForm: false }, true))
      return null
    }
  }

  const getContainerHeight = () => {
    if (isEmpty(purpose) && isEmpty(agreements)) {
      return '45%'
    } else if (isEmpty(purpose) || isEmpty(agreements)) {
      return '60%'
    } else {
      return '80%'
    }
  }

  return (
    <ScrollableModal
      isVisible={(!isEmpty(purpose) || !isEmpty(agreements) || !isEmpty(suggestedSkills)) && showJoinForm} // TODO: still need to figure out a practice for when the agreements change
      propagateSwipe={2 > 5}
      toggleModal={handleClose}
      containerStyle={{
        height: getContainerHeight(),
        padding: 15
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          marginTop: 12,
          marginBottom: 12,
          gap: 4
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ImageBackground source={bgImageSource} style={[styles.bannerBackground, styles.columnStyling]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <View style={styles.avatarContainer}>
                <FastImage source={imageSource} style={styles.groupAvatar} />
              </View>
              <Text style={styles.heading}>Welcome to:</Text>
            </View>
            <Text style={[styles.heading]}>{name}</Text>
          </ImageBackground>
        </View>
        {!isEmpty(purpose) &&
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={styles.sectionHeading}>Our Purpose:</Text>
            <Text style={styles.purposeText}>{purpose}</Text>
          </View>}
        {!isEmpty(agreements) && (
          <View style={{ width: '90%' }}>
            <Text style={styles.sectionHeading}>Our Agreements:</Text>
            {agreements.map((agreement, index) => (
              <View key={index} style={styles.agreementListItem}>
                <Text style={styles.listNumber}>{index + 1}.</Text>
                <View style={{ display: 'flex', gap: 4 }}>
                  <Text style={styles.agreementTitle}>{agreement.title}</Text>
                  <Text style={styles.agreementText}>{agreement.description}</Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'baseline', gap: 6 }}
                  >
                    <CheckBox
                      size={20}
                      fillColor={caribbeanGreen}
                      isChecked={acceptedAgreements[index] || acceptedAllAgreements}
                      onPress={() => handleCheckAgreement({ index, checked: !acceptedAgreements[index] })}
                      disableBuiltInState
                    />
                    <Text style={(acceptedAgreements[index] || acceptedAllAgreements) ? styles.agreementAccepted : styles.acceptanceText}>I agree to the above</Text>
                  </View>
                </View>
              </View>
            ))}
            {numAgreements >= 3 && (
              <TouchableOpacity
                onPress={handleCheckAllAgreements}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'baseline', gap: 6, marginTop: 8 }}
              >
                <CheckBox
                  size={20}
                  fillColor={caribbeanGreen}
                  isChecked={acceptedAllAgreements}
                  onPress={handleCheckAllAgreements}
                  disableBuiltInState
                />
                <Text style={acceptedAgreements ? styles.agreementAccepted : styles.acceptanceText}>Accept all agreements</Text>
              </TouchableOpacity>)}
          </View>
        )}
        {group?.settings?.showSuggestedSkills && group.suggestedSkills?.length > 0 &&
          <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleClose}>
          <View style={styles.callToAction}>
            <View style={styles.loginButton}>
              <Text style={styles.callToActionText}>Jump in!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ScrollableModal>
  )
}

export function SuggestedSkills ({ addSkill, currentUser, group, removeSkill }) {
  const [selectedSkills, setSelectedSkills] = useState(currentUser.skills ? currentUser.skills.toRefArray().map(s => s.id) : [])
  const [pills, setPills] = useState(group.suggestedSkills.map(skill => ({
    ...skill,
    label: skill.name
  })))

  const handleClick = (skillId) => {
    const hasSkill = selectedSkills.includes(skillId)
    if (hasSkill) {
      removeSkill(skillId)
      setSelectedSkills(selectedSkills.filter(s => s !== skillId))
    } else {
      addSkill(group.suggestedSkills.find(s => s.id === skillId).name)
      setSelectedSkills(selectedSkills.concat(skillId))
    }
  }

  return (
    <View style={styles.joinQuestions}>
      <Text>Which of the following skills & interests are relevant to you?</Text>
      <View style={styles.skillPills}>
        {pills && pills.map(pill => {
          const color = selectedSkills.includes(pill.id) ? caribbeanGreen : rhino
          return (
            <Pill
              key={pill.id}
              id={pill.id}
              label={pill.label}
              style={{ borderRadius: 15, borderWidth: 1, borderColor: color, padding: 6, margin: 5 }}
              displayColor={color}
              pressable={() => handleClick(pill.id)}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = {
  groupAvatar: {
    height: 20,
    width: 20
  },
  avatarContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 24,
    width: 24
  },
  columnStyling: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerBackground: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 500
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 5
  },
  callToAction: {
    height: 44
  },
  callToActionText: {
    flexGrow: 1,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 34,
    paddingLeft: 10,
    paddingRight: 10
  },
  purposeText: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  listNumber: {
    fontFamily: 'Circular-Book',
    width: 24,
    fontSize: 18
  },
  agreementListItem: {
    marginTop: 6,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row'
  },
  agreementText: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  agreementAccepted: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  optionCheckbox: {
    marginTop: 10,
    // color: caribbeanGreen,
    height: 16,
    width: 12,
    marginLeft: 2
  },
  sectionHeading: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 6
  },
  agreementTitle: {
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold'
  },
  acceptanceText: {
    fontFamily: 'Circular-Book',
    fontSize: 16,
    color: 'orange',
    lineHeight: 24
  },
  skillPills: {
    backgroundColor: 'rgba(255, 255, 255, 1.00)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  joinQuestions: {
    backgroundColor: 'rgba(249, 250, 251, 1.000)',
    borderWidth: 1,
    borderColor: 'rgba(224, 229, 233, 1.000)',
    borderRadius: 8,
    padding: 6,
    width: '90%',
    margin: 5
  }
}
