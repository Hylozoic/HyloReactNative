import React from 'react'

import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return Header(navigation, screenProps.currentTabName)
  }

  // TODO: REMOVE ME
  componentDidMount () {
    // const postId = '25791'
    const members = [
      {id: '4983', name: 'Edward', avatarUrl: 'https://www.gravatar.com/avatar/3373dcd93be68b96eeb0812955a68264?d=mm&s=140'},
      {id: '11204', name: 'Robbie Carlton', avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/11204/avatar/1467755857845_a14145223586391656938.jpeg'},
      {id: '13249', name: 'Lawrence + y', avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/13249/userAvatar/13249/the_letter_y.jpg'},
      {id: '13998', name: 'Edward Test', avatarUrl: 'https://www.gravatar.com/avatar/60fd35f003154b4a9362b773d3c77a16?d=mm&s=140'},
      {id: '14601', name: 'Edward West - Hylo', avatarUrl: 'https://www.gravatar.com/avatar/582cc413fedef12c6e8c01b7ee6bb90e?d=mm&s=140'},
      {id: '23247', name: 'Loren Johnson', avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/23247/userAvatar/23247/profile-1-4.jpg'}
    ]
    const updateMembers = chosenMembers => console.log('!!!! chosenMembers:', chosenMembers)
    this.props.navigation.navigate({routeName: 'ProjectMembersEditor', params: { members, updateMembers }})
  }
  //

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const { communityId, currentUser, navigation, networkId } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      communityId={communityId}
      navigation={navigation}
      networkId={networkId}
      screenProps={this.props.screenProps} />
  }
}
