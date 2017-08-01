import React, { Component } from 'react'
import { Linking } from 'react-native'

export default function createLinkingAwareContainer (Comp, uriPrefix) {
  const router = Comp.router
  return class extends Component {
    static router = router;

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
      const parsedUrl = this._urlToPathAndParams(url)
      if (parsedUrl) {
        const { path, params } = parsedUrl
        const action = router.getActionForPathAndParams(path, params)
        if (action) {
          this.props.navigation.dispatch(action)
        }
      }
    };

    componentDidMount () {
      Linking.addEventListener('url', ({ url }: { url: string }) => {
        this._handleOpenURL(url)
      })

      Linking.getInitialURL().then(
        (url: string) => url && this._handleOpenURL(url)
      )
    }

    componentWillUnmount () {
      Linking.removeEventListener('url', this._handleOpenURL)
    }

    render () {
      return <Comp {...this.props} />
    }
  }
}
