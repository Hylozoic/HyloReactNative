import React, { createElement } from 'react'
import { Navigator } from 'react-native-deprecated-custom-components'
import DrawerAndTabs from './DrawerAndTabs'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    const initialRoute = {
      render: navigator => <DrawerAndTabs rootNavigator={navigator} />
    }

    const renderScene = ({ render, component, props }, navigator) => {
      if (render) return render(navigator)

      // using createElement instead of JSX here because mixing destructuring
      // and JSX doesn't work as expected
      if (component) return createElement(component, {navigator, ...props})
    }

    return <Navigator style={styles.navigator} {...{initialRoute, renderScene}}
      configureScene={() => Navigator.SceneConfigs.FloatFromBottom} />
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)

const styles = {
  navigator: {
    // this is the color behind the receding view during FloatFromBottom
    backgroundColor: 'black'
  }
}
