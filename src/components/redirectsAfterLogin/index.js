import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { func } from 'prop-types'
import connector from './redirectsAfterLogin.connector'

export default function redirectsAfterLogin (Component) {
  const ConnectedComponent = connector(Component)

  class Wrapper extends React.Component {
    static contextTypes = {
      navigateToPath: func
    }

    render () {
      return <ConnectedComponent
        {...this.props}
        navigateToPath={this.context.navigateToPath} />
    }
  }

  return hoistStatics(Wrapper, ConnectedComponent)
}
