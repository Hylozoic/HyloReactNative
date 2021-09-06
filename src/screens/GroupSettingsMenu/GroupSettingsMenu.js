import React, { useLayoutEffect } from 'react'
import { TouchableOpacity, Text, FlatList, View } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './GroupSettingsMenu.style'

export const menuItems = [{
  name: 'Edit Group Info',
  navigate: 'Group Information'
}, {
  name: 'Group Moderators',
  navigate: 'Group Moderators'
}, {
  name: 'Invite Members',
  navigate: 'Invite Members'
}]

export default function GroupSettingsMenu ({ groupName, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: groupName
    });
  }, [navigation, groupName])

  return (
    <FlatList
      style={styles.container}
      data={menuItems}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(item.navigate)} style={styles.item}>
          <Text style={styles.text}>{item.name}</Text>
          <EntypoIcon style={styles.chevron} name='chevron-right' />
        </TouchableOpacity>
      )}
    />
  )
}
