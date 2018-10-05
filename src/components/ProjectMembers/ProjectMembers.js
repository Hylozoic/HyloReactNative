/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import styles from './ProjectMembers.styles'
import MemberList from '../MemberList/MemberList'
import header from 'util/header'

export default class ProjectMembers extends React.Component {
  static navigationOptions = ({navigation}) => header(navigation, {title: 'Project Members'})

  render () {
    const members = getNavigationParam('members', null, this.props)

    return <View style={styles.container}>
      <MemberList
        members={members}
        screenProps={this.props.screenProps}
        hideSortOptions
      />
    </View>
  }
}
