import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import {
  createGroup as createGroupAction,
  clearCreateGroupStore as clearCreateGroupStoreAction,
  getGroupData,
  getNewGroupParentGroups,
  CREATE_GROUP
} from '../CreateGroupFlow.store'
import Button from 'components/Button'
// import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SafeAreaView from 'react-native-safe-area-view'
import ErrorBubble from 'components/ErrorBubble'
import { formatDomainWithUrl } from '../util'
import { accessibilityDescription, visibilityDescription } from 'store/models/Group'
import ItemChooserItemRow from 'screens/ItemChooser/ItemChooserItemRow'
import Icon from 'components/Icon'
import { white } from 'style/colors'
import styles from '../CreateGroupFlow.styles'
import Avatar from 'components/Avatar'

export default function CreateGroupReview ({ navigation }) {
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const parentGroups = useSelector(getNewGroupParentGroups)
  const createGroupPending = useSelector(state => state.pending[CREATE_GROUP])
  const createGroup = groupData => dispatch(createGroupAction(groupData))
  const clearCreateGroupStore = () => dispatch(clearCreateGroupStoreAction())
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
    return createGroup(groupData)
      .then((data) => {
        if (data.error) {
          setError('There was an error, please try again.')
          return
        }
        clearCreateGroupStore()
        goToGroup(data.payload.data.createGroup.group)
      })
      .catch(() => {
        setError('There was an error, please try again.')
      })
  }

  /*
    HOLONIC TODO: This whole presentation has gotten cluttered, too white and green... etc
  */
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
              <Text style={styles.textInputLabel}>What's the name of your group?</Text>
              <EditButton onPress={goToCreateGroupName} />
            </View>
            <TextInput
              style={styles.textInput}
              value={groupData.name}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
          </View>

          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={styles.textInputLabel}>What's the URL of your group?</Text>
              <EditButton onPress={goToCreateGroupUrl} />
            </View>
            <TextInput
              style={styles.textInput}
              value={formatDomainWithUrl(groupData.slug)}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
          </View>
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={styles.textInputLabel}>Who can see this group?</Text>
            <EditButton onPress={goToCreateGroupVisibilityAccessibility} />
          </View>
          <TextInput
            style={[styles.textInput, { fontSize: 14 }]}
            multiline
            value={visibilityDescription(groupData.visibility)}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
        </View>

        <View style={styles.textInputContainer}>
          <View style={stepStyles.itemHeader}>
            <Text style={styles.textInputLabel}>Who can join this group?</Text>
            <EditButton onPress={goToCreateGroupVisibilityAccessibility} />
          </View>
          <TextInput
            style={[styles.textInput, { fontSize: 14 }]}
            multiline
            value={accessibilityDescription(groupData.accessibility)}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
        </View>

      {/*
        HOLONIC TODO: Needs help --
                      This will not scroll if this list gets long,
                      also probably better to wrap them onto
                      one or two lines...
      */}
      {parentGroups.length > 0 && (
          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={styles.textInputLabel}>Is this group a member of other groups?</Text>
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
  <View style={stepStyles.groupRow}>
    <Avatar style={stepStyles.groupAvatar} avatarUrl={group.avatarUrl} dimension={20} />
    <Text style={stepStyles.groupName}>{group.name}</Text>
  </View>
)

const EditButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.editContainer}>
    <Icon name='Edit' style={stepStyles.editIcon} />
  </TouchableOpacity>
)

const stepStyles = {
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  groupRows: {
    minWidth: '90%',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  groupRow: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  groupAvatar: {
    marginRight: 12
  },
  groupName: {
    fontFamily: 'Circular-Bold',
    fontSize: 12,
    color: white,
    flex: 1
  },
  editIcon: {
    fontSize: 22,
    color: white
  }
}
