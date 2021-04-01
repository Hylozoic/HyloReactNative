import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, FlatList } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import getMemberships from 'store/selectors/getMemberships'
// NOTE: Make a local copy of this if modification is needed
import ItemChooserItemRow from 'screens/ItemChooser/ItemChooserItemRow'
import { white } from 'style/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import { getGroupData, updateGroupData } from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupParentGroups ({ navigation }) {
  const nextScreen = 'CreateGroupReview'
  const groupData = useSelector(getGroupData)
  const dispatch = useDispatch()
  const [parentIds, setParentGroupIds] = useState(groupData.parentIds)
  const memberships = useSelector(getMemberships)
  const parentGroupOptions = memberships
    .filter(m => m.hasModeratorRole || m.group.accessibility === GROUP_ACCESSIBILITY.Open)
    .map((m) => m.group)
    .sort((a, b) => a.name.localeCompare(b.name))

  const isChosen = item => !!parentIds.find(groupId => groupId == item.id)

  const toggleChosen = item => parentIds.find(groupId => groupId == item.id)
    ? setParentGroupIds(parentIds.filter(groupId => groupId !== item.id))
    : setParentGroupIds([...parentIds, item.id])
  
  const clear = () => setParentGroupIds([])

  const checkAndSubmit = () => {
    // Extra step necessary to reject a current group selection which isn't valid
    parentIds.filter(id => parentGroupOptions.find(validId => id == validId))
    dispatch(updateGroupData({ parentIds }))
    navigation.navigate(nextScreen)
  }

  /*
    HOLONIC TODO: Not certain this should be shown to everyone (i.e. Tibet's remarks as well)
  */
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
        <Text style={styles.heading}>Is this group a member of other groups?</Text>
        <Text style={stepStyles.subHeading}>Please select below:</Text>
        <FlatList style={stepStyles.parentGroupListContainer} data={parentGroupOptions}
          renderItem={({ item }) => (
            <ItemChooserItemRow item={item} chosen={isChosen(item)} toggleChosen={toggleChosen} />
          )
        } />
        <TouchableOpacity onPress={clear}>
          <Text style={stepStyles.clearButton}>Clear</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Button text='Continue' onPress={checkAndSubmit} style={styles.button} />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
}

const stepStyles = {
  subHeading: {
    color: white,
    marginTop: 10,
    marginBottom: 10
  },
  clearButton: {
    color: white,
    marginTop: 10,
    marginRight: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-end'
  },
  parentGroupListContainer: {
    minWidth: '90%',
    padding: 0,
    backgroundColor: white,
    borderRadius: 15,
    maxHeight: '50%'
  }
}
