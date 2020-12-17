import React from 'react'
import { TouchableOpacity, Text, FlatList, View } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './CommunitySettingsMenu.style'

export const menuItems = [{
  name: 'Edit Community Info',
  navigate: 'Community Information'
}, {
  name: 'Community Moderators',
  navigate: 'Community Moderators'
}, {
  name: 'Invite Members',
  navigate: 'Invite Members'
}]

export default function CommunitySettingsMenu ({ communityName, navigation }) {
  return (
    <FlatList
      style={styles.container}
      data={menuItems}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{communityName}</Text>
        </View>
      }
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
