import React from 'react'
import { isDev } from 'util/testing'

export default class VersionCheck extends React.PureComponent {
  componentDidMount () {
    !isDev && this.props.checkVersion()
  }

  render () {
    return null
  }
}
