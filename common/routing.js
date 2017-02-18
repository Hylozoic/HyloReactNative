import React, { PropTypes } from 'react'
import WelcomeScene from './components/WelcomeScene'
import MyPosts from './components/MyPosts'
import Post from './components/Post'

export function renderScene (route, navigator) {
  return <NavigationContext navigator={navigator}>
    {componentForRoute(route)}
  </NavigationContext>
}

function componentForRoute (route) {
  switch (route.id) {
    case 'root':
      return <WelcomeScene />
    case 'myPosts':
      return <MyPosts />
    case 'post':
      return <Post post={route.post} />
  }
}

class NavigationContext extends React.Component {
  static childContextTypes = {
    navigator: PropTypes.shape({push: PropTypes.func})
  }

  getChildContext () {
    return {navigator: this.props.navigator}
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
