import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  Text, View, TextInput, ScrollView, TouchableOpacity
} from 'react-native'
import ErrorBubble from 'components/ErrorBubble'
import { accessibilityDescription, visibilityDescription } from 'store/models/Group'
import Avatar from 'components/Avatar'
import { formatDomainWithUrl } from './util'
import {
  createGroup, clearCreateGroupStore,getGroupData,
  getNewGroupParentGroups, CREATE_GROUP, setContinueButtonProps
} from './CreateGroupFlow.store'
import { white } from 'style/colors'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupReview ({ navigation }) {
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const parentGroups = useSelector(getNewGroupParentGroups)
  const createGroupPending = useSelector(state => state.pending[CREATE_GROUP])
  const [error, setError] = useState(null)
  const goToGroup = group => {
    navigation.closeDrawer()
    navigation.navigate('Feed', { groupId: group?.id })
  }

  useFocusEffect(useCallback(() => {
    dispatch(setContinueButtonProps({ text: "Let's Do This!" }))
    return () => dispatch(setContinueButtonProps({}))
  }, []))

  const submit = async () => {
    try {
      const data = await dispatch(createGroup(groupData))

      if (data.error) {
        setError('There was an error, please try again.')
      } else {
        dispatch(clearCreateGroupStore())
        goToGroup(data.payload.data.createGroup.group)
      }
    } catch (error) {
      setError('There was an error, please try again.')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.heading}>Everything look good?</Text>
          <Text style={styles.description}>You can always come back and change your details at any time</Text>
        </View>
        <View style={styles.content}>

          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>What's the name of your group?</Text>
              <EditButton onPress={() => navigation.navigate('CreateGroupName')} />
            </View>
            <TextInput
              style={stepStyles.reviewTextInput}
              value={groupData.name}
              underlineColorAndroid='transparent'
              disabled
            />
          </View>

          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>What's the URL of your group?</Text>
              <EditButton onPress={() => navigation.navigate('CreateGroupUrl')} />
            </View>
            <TextInput
              style={stepStyles.reviewTextInput}
              value={formatDomainWithUrl(groupData.slug)}
              underlineColorAndroid='transparent'
              disabled
            />
          </View>
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={stepStyles.textInputLabel}>Who can see this group?</Text>
            <EditButton onPress={() => navigation.navigate('CreateGroupVisibilityAccessibility')} />
          </View>
          <TextInput
            style={stepStyles.reviewTextInput}
            multiline
            value={visibilityDescription(groupData.visibility)}
            underlineColorAndroid='transparent'
            disabled
          />
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={stepStyles.textInputLabel}>Who can join this group?</Text>
            <EditButton onPress={() => navigation.navigate('CreateGroupVisibilityAccessibility')} />
          </View>
          <TextInput
            style={stepStyles.reviewTextInput}
            multiline
            value={accessibilityDescription(groupData.accessibility)}
            underlineColorAndroid='transparent'
            disabled
          />
        </View>

        {parentGroups.length > 0 && (
          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>Is this group a member of other groups?</Text>
              <EditButton onPress={() => navigation.navigate('CreateGroupParentGroups')} />
            </View>
            <View style={stepStyles.groupRows}>
              {parentGroups.map(parentGroup => <GroupRow group={parentGroup} key={parentGroup.id} />)}
            </View>
          </View>
        )}

        {error && <View style={styles.errorBubble}><ErrorBubble text={error} /></View>}
      </ScrollView>
    </View>
  )
}

const GroupRow = ({ group }) => (
  <View style={stepStyles.groupRow} key={group.name}>
    <Avatar style={stepStyles.groupAvatar} avatarUrl={group.avatarUrl} dimension={20} />
    <Text style={stepStyles.groupName}>{group.name}</Text>
  </View>
)

const EditButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={stepStyles.editLink}>Edit</Text>
  </TouchableOpacity>
)

const stepStyles = {
  textInputLabel: {
    color: white,
    fontSize: 16,
    marginBottom: 5
  },
  reviewTextInput: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 0,
    paddingBottom: 25
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  groupRows: {
    marginTop: 10,
    minWidth: '90%',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  groupRow: {
    marginBottom: 10,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  groupAvatar: {
    marginRight: 14
  },
  groupName: {
    fontFamily: 'Circular-Bold',
    fontSize: 14,
    color: white,
    flex: 1
  },
  editLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: white
  },
  editIcon: {
    fontSize: 22,
    color: white
  }
}
