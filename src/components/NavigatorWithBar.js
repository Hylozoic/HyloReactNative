import React, { PropTypes } from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components'
import mixins from '../style/mixins'
import makeRenderScene from '../util/makeRenderScene'

export default class NavigatorWithBar extends React.Component {
  static propTypes = {
    openDrawer: PropTypes.func.isRequired,
    variant: PropTypes.string,
    navigatorProps: PropTypes.object,
    onNavigate: PropTypes.func,
    onBackToTop: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.routeMapper = {
      LeftButton: (route, navigator, index, navState) => {
        if (this.isAtTop(navigator)) {
          return <TouchableOpacity onPress={this.props.openDrawer}>
            <Text style={styles.navigationLeftButton}>Menu</Text>
          </TouchableOpacity>
        }
        const onBackPress = () => {
          navigator.pop()
          if (this.willBeAtTop(navigator)) this.props.onBackToTop()
        }
        return <TouchableOpacity onPress={onBackPress}>
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

  componentDidMount () {
    ['push', 'popToTop'].forEach(fn => {
      this[fn] = this.navigator[fn]
    })
  }

  willBeAtTop (navigator = this.navigator) {
    return navigator.getCurrentRoutes().length === 2
  }

  isAtTop (navigator = this.navigator) {
    return navigator.getCurrentRoutes().length === 1
  }

  render () {
    const { onNavigate, navigatorProps } = this.props
    const renderScene = makeRenderScene({onNavigate})

    const navigationBar = <Navigator.NavigationBar
      style={styles.navigationBar[this.props.variant]}
      routeMapper={this.routeMapper} />

    return <Navigator {...navigatorProps} renderScene={renderScene}
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
