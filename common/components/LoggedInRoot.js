import React, { createElement } from 'react'
import { Navigator } from 'react-native'
import DrawerAndTabs from './DrawerAndTabs'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
export default function LoggedInRoot () {
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

const styles = {
  navigator: {
    // this is the color behind the receding view during FloatFromBottom
    backgroundColor: 'black'
  }
}
