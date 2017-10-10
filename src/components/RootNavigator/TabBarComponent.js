import React from 'react'
import { Keyboard } from 'react-native'
import { TabBarBottom } from 'react-navigation'

// TODO remove this once https://github.com/react-community/react-navigation/pull/1764 is checked in and released

class TabBarComponent extends React.PureComponent {
  constructor (props) {
    super(props)

    this.keyboardWillShow = this.keyboardWillShow.bind(this)
    this.keyboardWillHide = this.keyboardWillHide.bind(this)

    this.state = {
      isVisible: true
    }
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  }

  componentWillUnmount () {
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
    console.log("tabbarcomponent", this.state.isVisible)
    return this.state.isVisible ? <TabBarBottom {...this.props} />
      : null
  }
}

export default TabBarComponent
