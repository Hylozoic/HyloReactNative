/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import styles from './ProjectMembers.styles'
import MemberList from 'components/MemberList/MemberList'
import header from 'navigation/header'
import goToMemberMaker from 'store/actions/goToMemberMaker'

export default class ProjectMembers extends React.Component {
  render () {
    const { members } = this.props.route.params
    const showMember = goToMemberMaker(this.props.navigation)

    return (
      <View style={styles.container}>
        <MemberList
          members={members}
          hideSortOptions
          showMember={showMember}
        />
      </View>
    )
  }
}
