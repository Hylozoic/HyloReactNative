import React from 'react'
import Loading from '../../Loading'
import Button from '../../Button'
import styles from './Projects.styles'
import Feed from '../../Feed'

export default class Projects extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  goToCreateProject = () => {
    const { communityId } = this.props
    this.props.navigation.navigate('PostEditor', {communityId: communityId, isProject: true})
  }

  render () {
    const { communityId, currentUser, navigation, networkId } = this.props

    const isNetwork = !!networkId

    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed
      communityId={communityId}
      navigation={navigation}
      networkId={networkId}
      screenProps={this.props.screenProps}
      belowBannerComponent={!isNetwork && <CreateProjectButton createProject={this.goToCreateProject} />}
      hidePostPrompt
      isProjectFeed />
  }
}

export function CreateProjectButton ({ createProject }) {
  return <Button
    style={styles.button}
    text='Create Project'
    onPress={createProject} />
}
