import React from 'react'
import {
  Navigator,
  Text,
  TouchableOpacity
} from 'react-native'
import mixins from '../style/mixins'
import { renderScene } from '../routing'

export default class Home extends React.Component {
  static propTypes = {openDrawer: React.PropTypes.func}

  constructor (props) {
    super(props)

    this.routeMapper = {
      LeftButton: (route, navigator, index, navState) => {
        if (route.index === 0) {
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

  render () {
    return <Navigator
      initialRoute={{id: 'root', title: 'Welcome', index: 0}}
      renderScene={renderScene}
      navigationBar={<Navigator.NavigationBar
        style={styles.navigationBar}
        routeMapper={this.routeMapper} />} />
  }
}

const styles = {
  navigationBar: {
    backgroundColor: '#22bf99'
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
