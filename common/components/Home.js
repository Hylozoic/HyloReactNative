import React from 'react'
import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import {
  Navigator,
  Text,
  TouchableOpacity
} from 'react-native'
import mixins from '../style/mixins'

const router = (route, navigator) => {
  switch (route.name) {
    case 'root':
      return <WelcomeScene
        showMyPosts={() => {
          navigator.push({
            title: 'Your Posts',
            name: 'myPosts',
            index: route.index + 1
          })
        }} />
    case 'myPosts':
      return <MyPosts title={route.title} />
  }
}

export default class Home extends React.Component {
  render () {
    const routeMapper = {
      LeftButton: (route, navigator, index, navState) => {
        if (route.index === 0) {
          return null
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

    return <Navigator
      initialRoute={{name: 'root', title: 'Welcome', index: 0}}
      renderScene={router}
      navigationBar={<Navigator.NavigationBar
        style={styles.navigationBar}
        routeMapper={routeMapper} />} />
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
