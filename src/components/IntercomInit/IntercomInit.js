import React from 'react'
import Intercom from 'react-native-intercom'

export default class VersionCheck extends React.PureComponent {
  componentDidMount () {
    this.registerUser()
  }

  componentDidUpdate (prevProps) {
    if (this.props.currentUser.intercomHash !== prevProps.currentUser.intercomHash) {
      this.registerUser()
    }
  }

  registerUser () {
    const { currentUser } = this.props
    console.log('registering user', currentUser)
    if (!this.props.currentUser.intercomHash) return
    console.log('hash exists, going to intercom')
    // Intercom.registerUser({
    //   userId: currentUser.id
    // })
    // Intercom.setUserHash(currentUser.hash)
    // Intercom.updateUser({
    //   email: currentUser.email,
    //   user_id: currentUser.id,
    //   name: currentUser.name
    // })
  }

  render () {
    return null
  }
}
