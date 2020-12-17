import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import { render } from '@testing-library/react-native'
import RootView from 'components/RootView'
import { CHECK_SESSION_AND_SET_SIGNED_IN } from 'store/constants'

describe('RootView', () => {
  const renderSnapshot = state => (
    render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    ).toJSON()
  )
  
  it('loading without signupInProgress - matches snapshot', () => {
    const state = {
      pending: { CHECK_SESSION_AND_SET_SIGNED_IN },
      session: { signupInProgress: false }
    }
    expect(renderSnapshot(state)).toMatchSnapshot()
  })

  it('loading with signupInProgress - matches snapshot', () => {
    const state = {
      pending: { CHECK_SESSION_AND_SET_SIGNED_IN },
      session: { signupInProgress: true }
    }
    expect(renderSnapshot(state)).toMatchSnapshot()
  })

  it('signedIn and signupInProgress matches snapshot', () => {
    const state = {
      pending: {},
      session: { signedIn: true, signupInProgress: true }
    }
    expect(renderSnapshot(state)).toMatchSnapshot()
  })

  it('signedIn but not signupInProgress matches snapshot', () => {
    const state = {
      pending: {},
      session: { signedIn: true }
    }
    expect(renderSnapshot(state)).toMatchSnapshot()
  })
})
