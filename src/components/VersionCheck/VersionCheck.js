import React from 'react'

export default class VersionCheck extends React.PureComponent {
  componentDidMount () {
    this.props.checkVersion()
  }

  render () {
    return null
  }
}
