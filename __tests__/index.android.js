import 'react-native'
import React from 'react'
import Index from '../index.android.js'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  fetch.mockResponseSuccess({
    data: {
      me: {
        id: 1,
        name: 'Foo',
        avatarUrl: 'nope'
      }
    }
  })

  const tree = renderer.create(
    <Index />
  )
})
