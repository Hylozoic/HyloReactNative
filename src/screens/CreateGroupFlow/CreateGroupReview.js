import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Text, View, TextInput, ScrollView, TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { openURL } from 'hooks/useOpenURL'
import ErrorBubble from 'components/ErrorBubble'
import { accessibilityDescription, visibilityDescription } from 'store/models/Group'
import Avatar from 'components/Avatar'
import { formatDomainWithUrl } from './util'
import {
  createGroup, clearCreateGroupStore, getGroupData,
  getNewGroupParentGroups
} from './CreateGroupFlow.store'
import { white } from 'style/colors'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupReview () {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const parentGroups = useSelector(getNewGroupParentGroups)
  const [error, setError] = useState(null)


  useEffect(() => {
    return navigation.addListener('tabPress', async event => {
      event.preventDefault()
      await submit()
    })
  }, [navigation, groupData])

  const submit = async () => {
    try {
      const graphqlResponse = await dispatch(createGroup(groupData))
      const newGroup = graphqlResponse.payload?.getData()
      if (newGroup) {
        dispatch(clearCreateGroupStore())
        openURL(`/groups/${newGroup.slug}`)
      } else {
        setError('Group may have been created, but there was an error. Please contact Hylo support.')
      }
    } catch (e) {
      setError(e.message)
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
              editable={false}
              selectTextOnFocus={false}
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
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.textInputContainer}>
            <View style={stepStyles.itemHeader}>
              <Text style={stepStyles.textInputLabel}>What is the purpose of this group</Text>
              <EditButton onPress={() => navigation.navigate('CreateGroupPurpose')} />
            </View>
            <TextInput
              style={stepStyles.reviewTextInput}
              multiline
              value={groupData.purpose}
              underlineColorAndroid='transparent'
              editable={false}
              selectTextOnFocus={false}
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
            editable={false}
            selectTextOnFocus={false}
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
            editable={false}
            selectTextOnFocus={false}
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
    paddingBottom: 20
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  groupRows: {
    marginTop: 10,
    paddingBottom: 13,
    minWidth: '90%',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  groupRow: {
    marginBottom: 10,
    paddingBottom: 0,
    flexDirection: 'row'
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
