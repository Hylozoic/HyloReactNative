import React, { createElement, PropTypes } from 'react'

export default function makeRenderScene ({ onNavigate }) {
  return function renderScene ({ component, props }, navigator) {
    return <NavigationContext navigator={navigator} onNavigate={onNavigate}>
      {createElement(component, props)}
    </NavigationContext>
  }
}

class NavigationContext extends React.Component {
  static propTypes = {
    onNavigate: PropTypes.func
  }

  static childContextTypes = {
    navigate: PropTypes.func,
    goBack: PropTypes.func
  }

  getChildContext () {
    const { onNavigate } = this.props
    return {
      navigate: route => {
        if (onNavigate) onNavigate(route)
        return this.props.navigator.push(route)
      },
      goBack: () => {
        return this.props.navigator.pop()
      }
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
