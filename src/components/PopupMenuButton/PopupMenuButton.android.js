import React, { Component } from 'react'
import { View, UIManager, findNodeHandle, TouchableOpacity } from 'react-native'

export default class PopupMenuButton extends Component {
  onError (e) {
    console.error('Error opening popupMenu', e)
  }

  onSelect = (action, index) => {
    if (action === 'itemSelected') {
      this.props.onSelect(index)
    }
  }

  onPress = () => {
    if (this.button) {
      UIManager.showPopupMenu(
        findNodeHandle(this.button),
        this.props.actions,
        this.onError,
        this.onSelect
      )
    }
  }

  render () {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress} ref={this.onRef}>
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
