import React, { PropTypes } from 'react'
import {
  Navigator,
  Text,
  TouchableOpacity
} from 'react-native'
import mixins from '../style/mixins'
import { renderScene } from '../routing'

export default class NavigatorWithBar extends React.Component {
  static propTypes = {
    openDrawer: PropTypes.func.isRequired,
    variant: PropTypes.string,
    navigatorProps: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.routeMapper = {
      LeftButton: (route, navigator, index, navState) => {
        if (navigator.getCurrentRoutes().length === 1) {
          return <TouchableOpacity onPress={this.props.openDrawer}>
            <Text style={styles.navigationLeftButton}>Menu</Text>
          </TouchableOpacity>
        }
        return <TouchableOpacity onPress={() => navigator.pop()}>
          <Text style={styles.navigationLeftButton}>&lt; Back</Text>
        </TouchableOpacity>
      },
      RightButton: (route, navigator, index, navState) => {
        return null
      },
      Title: (route, navigator, index, navState) => {
        return <Text style={styles.navigationTitle}>{route.title}</Text>
      }
    }
  }

  push (route) {
    return this.navigator.push(route)
  }

  render () {
    const navigationBar = <Navigator.NavigationBar
      style={styles.navigationBar[this.props.variant]}
      routeMapper={this.routeMapper} />

    return <Navigator {...this.props.navigatorProps} renderScene={renderScene}
      navigationBar={navigationBar}
      ref={ref => { this.navigator = ref }} />
  }
}

const styles = {
  navigationBar: {
    home: {
      backgroundColor: '#0dc3a0'
    },
    members: {
      backgroundColor: '#9883e5'
    },
    topics: {
      backgroundColor: '#bb60a8'
    }
  },
  navigationTitle: {
    ...mixins.navigationText
  },
  navigationLeftButton: {
    ...mixins.navigationText,
    paddingLeft: 10,
    paddingRight: 10
  }
}
