import React, { Component, PropTypes } from 'react'
import { View, UIManager, findNodeHandle, TouchableOpacity } from 'react-native'

export default class PopupMenu extends Component {
  static propTypes = {
    // array of strings, will be list items of Menu
    actions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired
  }

  onError () {
    console.log('Popup Error')
  }

  onPress = () => {
    if (this.button) {
      UIManager.showPopupMenu(
        findNodeHandle(this.button),
        this.props.actions,
        this.onError,
        this.props.onSelect
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
