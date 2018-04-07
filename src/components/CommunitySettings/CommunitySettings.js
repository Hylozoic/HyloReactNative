import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  View
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { capeCod40, capeCod20, white } from 'style/colors'
import header from 'util/header'

export default class PostImage extends PureComponent {
  static navigationOptions = ({navigation}) => header(navigation, {title: 'Community Settings'})

  navigate = (screen) => this.props.navigation.navigate(screen)

  render () {
    const { communityName } = this.props

    const menuItems = [{
      key: '1',
      name: 'Edit Community Info',
      navigate: 'UserSettings' // TODO change me
    }, {
      key: '2',
      name: 'Community Members',
      navigate: 'UserSettings' // TODO change me
    }, {
      key: '3',
      name: 'Invite Members',
      navigate: 'InvitePeople'
    }]

    return (<FlatList style={styles.container}
      data={menuItems}
      ListHeaderComponent={<View style={styles.headerContainer}><Text style={styles.headerText}>{communityName}</Text></View>}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <TouchableOpacity onPress={() => this.navigate(item.navigate)} style={styles.item} >
        <Text style={styles.text}>{item.name}</Text>
        <EntypoIcon style={styles.chevron} name={'chevron-right'} />
      </TouchableOpacity>} />)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: white
  },
  headerText: {
    backgroundColor: '#FAFBFC',
    padding: 20,
    width: '90%',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontFamily: 'Circular-Book',
    fontSize: 24
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '90%',
    marginLeft: '5%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: capeCod40
  },
  text: {
    fontSize: 22,
    flex: 1
  },
  chevron: {
    marginRight: 12,
    fontSize: 24,
    color: capeCod20
  }
})
