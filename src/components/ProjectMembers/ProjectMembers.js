/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import styles from './ProjectMembers.styles'
import MemberList from '../MemberList'
import header from 'util/header'

export default class ProjectMembers extends React.Component {
  static navigationOptions = ({navigation}) => header(navigation, {title: 'Project Members'})

  render () {
    return <View style={styles.container}>
      <MemberList subject='project' screenProps={this.props.screenProps} />
    </View>
  }
}
