import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Text, View, TextInput, TouchableOpacity} from 'react-native'
import Button from 'components/Button'
// import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SafeAreaView from 'react-native-safe-area-view'
import ErrorBubble from 'components/ErrorBubble'
import { accessibilityDescription, visibilityDescription } from 'store/models/Group'
import Icon from 'components/Icon'
import { white } from 'style/colors'
import Avatar from 'components/Avatar'
import { formatDomainWithUrl } from './util'
import {
  createGroup, clearCreateGroupStore,getGroupData,
  getNewGroupParentGroups, CREATE_GROUP
} from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupReview ({ navigation }) {
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const parentGroups = useSelector(getNewGroupParentGroups)
  const createGroupPending = useSelector(state => state.pending[CREATE_GROUP])

  const goToCreateGroupName = () => navigation.navigate('CreateGroupName')
  const goToCreateGroupUrl = () => navigation.navigate('CreateGroupUrl')
  const goToCreateGroupVisibilityAccessibility = () =>
    navigation.navigate('CreateGroupVisibilityAccessibility')
  const goToCreateGroupParentGroups = () =>
    navigation.navigate('CreateGroupParentGroups')
  const goToGroup = group => {
    navigation.closeDrawer()
    navigation.navigate('Feed', { groupId: group?.id })
  }

  const submit = () => {
    return dispatch(createGroup(groupData))
      .then((data) => {
        if (data.error) {
          setError('There was an error, please try again.')
          return
        }
        dispatch(clearCreateGroupStore())
        goToGroup(data.payload.data.createGroup.group)
      })
      .catch(() => {
        setError('There was an error, please try again.')
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.heading}>Everything look good?</Text>
          <Text style={styles.description}>You can always come back and change your details at any time</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>What's the name of your group?</Text>
              <EditButton onPress={goToCreateGroupName} />
            </View>
            <TextInput
              style={stepStyles.reviewTextInput}
              value={groupData.name}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
          </View>

          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>What's the URL of your group?</Text>
              <EditButton onPress={goToCreateGroupUrl} />
            </View>
            <TextInput
              style={stepStyles.reviewTextInput}
              value={formatDomainWithUrl(groupData.slug)}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
          </View>
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={stepStyles.textInputLabel}>Who can see this group?</Text>
            <EditButton onPress={goToCreateGroupVisibilityAccessibility} />
          </View>
          <TextInput
            style={stepStyles.reviewTextInput}
            multiline
            value={visibilityDescription(groupData.visibility)}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={stepStyles.textInputLabel}>Who can join this group?</Text>
            <EditButton onPress={goToCreateGroupVisibilityAccessibility} />
          </View>
          <TextInput
            style={stepStyles.reviewTextInput}
            multiline
            value={accessibilityDescription(groupData.accessibility)}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
        </View>
        {parentGroups.length > 0 && (
          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>Is this group a member of other groups?</Text>
              <EditButton onPress={goToCreateGroupParentGroups} />
            </View>
            <View style={stepStyles.groupRows}>
              {parentGroups.map(parentGroup => <GroupRow group={parentGroup} />)}
            </View>
          </View>
        )}

        {error && <View style={styles.errorBubble}><ErrorBubble text={error} /></View>}

        <View style={styles.footer}>
          <Button
            text="Let's Do This!"
            onPress={submit}
            style={styles.button}
            disabled={!!createGroupPending}
          />
        </View>
      </View>
    </SafeAreaView>
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
    marginBottom: 25,
    // HOLONIC TODO: Was only needed for multiline text inputs
    //               in iOS (haven't tested in Android)
    paddingTop: -5
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
