import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import { render } from '@testing-library/react-native'
import RootView from 'navigation/RootView'
import { FETCH_CURRENT_USER } from 'store/constants'
import orm from 'store/models'
// import NetInfo from '@react-native-community/netinfo'
import { getSessionCookie } from 'util/session'
import { ACTION_APPROVED_JOIN_REQUEST } from 'store/models/Notification'
// jest.mock('@react-native-community/netinfo')

jest.mock('util/session', () => {
  getSessionCookie: jest.fn()
})

let ormSession

describe('RootView', () => {  
  beforeAll(() => {
    ormSession = orm.session(orm.getEmptyState())
    ormSession.Me.create({ id: '1' })
  })

  it('loading without signupInProgress - matches snapshot', async () => {
    const state = {
      orm: ormSession.state,
      pending: { FETCH_CURRENT_USER },
      session: {
        signupInProgress: false
      },
    }
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('no loading indicator when signupInProgress - matches snapshot', async () => {
    const state = {
      orm: ormSession.state,
      pending: { FETCH_CURRENT_USER },
      session: {
        signupInProgress: false
      }
    }
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('signedIn and signupInProgress matches snapshot', async () => {
    const state = {
      orm: ormSession.state,
      pending: {},
      session: {
        signedIn: true,
        signupInProgress: true
      }
    }
    const { toJSON } = await render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('signedIn but not signupInProgress matches snapshot', async () => {
    const state = {
      orm: ormSession.state,
      pending: {},
      session: { signedIn: true }
    }
    const { toJSON } = await render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
