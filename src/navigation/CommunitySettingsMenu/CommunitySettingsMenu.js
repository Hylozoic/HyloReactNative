import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  Text,
  FlatList,
  View
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import header from 'navigation/header'
import styles from './CommunitySettingsMenu.style'

export default class PostImage extends PureComponent {
  static navigationOptions = ({ navigation, route }) =>
    header(navigation, route, { title: 'Community Settings' })

  navigate = (screen) => this.props.navigation.navigate(screen)

  render () {
    const { communityName } = this.props

    const menuItems = [{
      name: 'Edit Community Info',
      navigate: 'CommunitySettings'
    }, {
      name: 'Community Moderators',
      navigate: 'ModeratorSettings'
    }, {
      name: 'Invite Members',
      navigate: 'InvitePeople'
    }]

    return (
      <FlatList
        style={styles.container}
        data={menuItems}
        ListHeaderComponent={<View style={styles.headerContainer}><Text style={styles.headerText}>{communityName}</Text></View>}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <TouchableOpacity onPress={() => this.navigate(item.navigate)} style={styles.item}>
          <Text style={styles.text}>{item.name}</Text>
          <EntypoIcon style={styles.chevron} name='chevron-right' />
                                  </TouchableOpacity>}
      />
    )
  }
}
