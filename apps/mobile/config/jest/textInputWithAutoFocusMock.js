// Required curently as TextInput#autoFocus causes tests to crash
// ref: https://github.com/facebook/jest/issues/3707#issuecomment-311169259
jest.mock('TextInput', () => {
  const RealComponent = jest.requireActual('TextInput')
  const React = require('React')
  class TextInput extends React.Component {
    render () {
      delete this.props.autoFocus
      return React.createElement('TextInput', this.props, this.props.children)
    }
  }
  TextInput.propTypes = RealComponent.propTypes
  return TextInput
})
