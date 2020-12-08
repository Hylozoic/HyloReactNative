// THIS COMPONENT IS CURRENTLY BEING BYPASSED (SEE RENDER METHOD)



import React from 'react'
import { Keyboard } from 'react-native'
// import { TabBarBottom } from 'react-navigation'
import { isIOS } from 'util/platform'

// This is a workaround for android to get the tabbar to hide when keyboard is shown.
// TODO remove this once https://github.com/react-community/react-navigation/pull/1764 is checked in and released

export default class TabBar extends React.PureComponent {
  constructor (props) {
    super(props)

    this.keyboardWillShow = this.keyboardWillShow.bind(this)
    this.keyboardWillHide = this.keyboardWillHide.bind(this)

    this.state = {
      isVisible: true
    }
  }

  UNSAFE_componentWillMount () {
    if (isIOS) return
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  }

  componentWillUnmount () {
    if (isIOS) return
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow = event => {
    this.setState({
      isVisible: false
    })
  }

  keyboardWillHide = event => {
    this.setState({
      isVisible: true
    })
  }

  render () {
    return null // this.state.isVisible && this.props.isVisible
      // ? <TabBarBottom {...this.props} />
      // : null
  }
}
