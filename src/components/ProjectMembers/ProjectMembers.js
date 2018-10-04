/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import styles from './ProjectMembers.styles'
import ProjectMemberList from '../MemberList/ProjectMemberList'
import header from 'util/header'

export default class ProjectMembers extends React.Component {
  static navigationOptions = ({navigation}) => header(navigation, {title: 'Project Members'})

  render () {
    return <View style={styles.container}>
      <ProjectMemberList subject='project' screenProps={this.props.screenProps} />
    </View>
  }
}
