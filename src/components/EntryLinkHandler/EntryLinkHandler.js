import React from 'react'
import { Linking } from 'react-native'
import OneSignal from 'react-native-onesignal'
import { get } from 'lodash/fp'
import URL from 'url'

export default class EntryLinkHandler extends React.Component {
  componentWillMount () {
    console.log('EntryLinkHandler componentWillMount')
    Linking.getInitialURL().then(this.handleUrl)
    Linking.addEventListener('url', this.handleUrl)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleUrl)
  }

  handleUrl = eventOrUrl => {
    const url = get('url', eventOrUrl) || eventOrUrl
    if (!url) return

    const { path } = URL.parse(url)
    if (path) this.props.setEntryUrl(path)
  }

  render () {
    return null
  }
}
