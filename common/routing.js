import React, { PropTypes } from 'react'
import WelcomeScene from './components/WelcomeScene'
import MyPosts from './components/MyPosts'
import Post from './components/Post'

export function makeRenderScene ({ onNavigate }) {
  return function renderScene (route, navigator) {
    return <NavigationContext navigator={navigator} onNavigate={onNavigate}>
      {componentForRoute(route)}
    </NavigationContext>
  }
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
  static propTypes = {
    onNavigate: PropTypes.func
  }

  static childContextTypes = {
    navigate: PropTypes.func
  }

  getChildContext () {
    const { onNavigate } = this.props
    return {
      navigate: route => {
        if (onNavigate) onNavigate(route)
        return this.props.navigator.push(route)
      }
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
