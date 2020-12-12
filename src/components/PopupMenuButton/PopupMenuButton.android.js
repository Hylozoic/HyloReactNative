import React from 'react'
import { UIManager, findNodeHandle, TouchableOpacity } from 'react-native'

export default class PopupMenuButton extends React.PureComponent {
  state = {
    open: false
  }

  onError (e) {
    this.setState({ open: false })
    throw new Error('Error opening popup')
  }

  onSelect = (action, index) => {
    this.setState({ open: false })
    if (action === 'itemSelected') {
      this.props.actions[index][1]()
    }
  }

  onPress = () => {
    if (this.button && !this.state.open) {
      UIManager.showPopupMenu(
        findNodeHandle(this.button),
        this.props.actions.map(a => a[0]),
        this.onError,
        this.onSelect
      )
    }
  }

  render () {
    const hitSlop = this.props.hitSlop || { top: 5, bottom: 5, left: 5, right: 5 }

    return (
      <TouchableOpacity
        {...this.props.viewProps}
        style={this.props.style}
        hitSlop={hitSlop}
        onPress={this.onPress}
        ref={this.onRef}
      >
        {this.props.children}
      </TouchableOpacity>
    )
  }

  onRef = button => {
    if (!this.button) {
      this.button = button
    }
  }
}
