import React, { createElement } from 'react'
import { func } from 'prop-types'

export default function makeRenderScene ({ onNavigate }) {
  return function renderScene ({ component, props }, navigator) {
    return <NavigationContext navigator={navigator} onNavigate={onNavigate}>
      {createElement(component, props)}
    </NavigationContext>
  }
}

class NavigationContext extends React.Component {
  static propTypes = {
    onNavigate: func
  }

  static childContextTypes = {
    navigate: func
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
