import React from 'react'
import { TouchableOpacity } from 'react-native'

export default class ActionSheet extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.showActionSheetWithOptions = context.showActionSheetWithOptions
  }

  render() {
    const { children } = this.props
    return (
      <TouchableOpacity onPress={this._onOpenActionSheet}>
        { children }
      </TouchableOpacity>
    )
  }

  _onOpenActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ['Delete', 'Cancel']
    let destructiveButtonIndex = 0
    let cancelButtonIndex = 1
    console.log(this.context)
    this.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        // Do something here depending on the button index selected
      }
    )
  }
}

ActionSheet.contextTypes = {
  showActionSheetWithOptions: React.PropTypes.func,
}
