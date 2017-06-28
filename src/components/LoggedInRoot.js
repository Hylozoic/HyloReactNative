import React from 'react'
import DrawerAndTabs from './DrawerAndTabs'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  static navigationOptions = {
    title: 'Menu'
  };

  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    return (
      <ActionSheetProvider>
        <DrawerAndTabs />
      </ActionSheetProvider>
    )
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)

const styles = {
  navigator: {
    // this is the color behind the receding view during FloatFromBottom
    backgroundColor: 'black'
  }
}
