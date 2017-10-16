import React, { Component } from 'react'
import { View, UIManager, findNodeHandle, TouchableOpacity } from 'react-native'

export default class PopupMenuButton extends Component {
  state = {
    open: false
  }

  onError (e) {
    this.setState({open: false})
    throw new Error('Error opening popup')
  }

  onSelect = (action, index) => {
    this.setState({open: false})
    if (action === 'itemSelected') {
      this.props.onSelect(index)
    }
  }

  onPress = () => {
    if (this.button && !this.state.open) {
      UIManager.showPopupMenu(
        findNodeHandle(this.button),
        this.props.actions,
        this.onError,
        this.onSelect
      )
    }
  }

  render () {
    const hitSlop = this.props.hitSlop || {top: 5, bottom: 5, left: 5, right: 5}

    return (
      <View style={this.props.style}>
        <TouchableOpacity hitSlop={hitSlop} {...this.props.viewProps}
          onPress={this.onPress} ref={this.onRef}>
          { this.props.children }
        </TouchableOpacity>
      </View>
    )
  }

  onRef = button => {
    if (!this.button) {
      this.button = button
    }
  }
}
