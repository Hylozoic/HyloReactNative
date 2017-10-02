import React, { Component } from 'react'
import { Linking } from 'react-native'

export default function createLinkingAwareContainer (Comp, uriPrefix) {
  const router = Comp.router
  return class extends Component {
    static router = router

    _urlToPathAndParams (url: string) {
      const params = {}
      const delimiter = uriPrefix || '://'
      let path = url.split(delimiter)[1]
      if (!path) {
        path = url
      }
      return {
        path,
        params
      }
    }

    _handleOpenURL = (url) => {
      console.log('!!!!', url)
      const parsedUrl = this._urlToPathAndParams(url)
      if (parsedUrl) {
        const { path, params } = parsedUrl
        console.log('!!! parsedUrl: ', parsedUrl)
        const action = router.getActionForPathAndParams(path, params)
        if (action) {
          this.props.navigation.dispatch(action)
        }
      }
    }

    componentDidMount () {
      // // this handles the case where the app is closed and is launched via Universal Linking.
      // Linking.getInitialURL()
      // .then((url) => {
      //   if (url) {
      //     this._handleOpenURL(url)
      //   }
      // })
      // .catch((e) => {})
      // // This listener handles the case where the app is woken up from the Universal Linking
      // Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))
    }

    componentWillUnmount () {
      // Linking.removeEventListener('url', this._handleOpenURL)
    }

    render () {
      return <Comp {...this.props} />
    }
  }
}
