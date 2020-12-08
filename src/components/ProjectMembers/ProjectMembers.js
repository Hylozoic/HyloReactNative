/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import styles from './ProjectMembers.styles'
import MemberList from '../MemberList/MemberList'
import header from 'util/header'
import goToMemberMaker from '../../store/actions/goToMemberMaker'

export default class ProjectMembers extends React.Component {
  static navigationOptions = ({ navigation, route }) =>
    header(navigation, route, { title: 'Project Members' })

  render () {
    const { members } = this.props.route.params
    const showMember = goToMemberMaker(this.props.navigation)

    return <View style={styles.container}>
      <MemberList
        members={members}
        screenProps={this.props.screenProps}
        hideSortOptions
        showMember={showMember}
      />
    </View>
  }
}
