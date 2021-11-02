import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import { render, act } from '@testing-library/react-native'
import RootView from 'navigation/RootView'
import { FETCH_CURRENT_USER } from 'store/constants'
import orm from 'store/models'
import getEmptyState from 'store/getEmptyState'

// let ormSession

// describe('RootView', () => {  
//   beforeAll(() => {
//     ormSession = orm.session(orm.getEmptyState())
//     ormSession.Me.create({ id: '1' })
//   })

//   it('loading without signupInProgress - matches snapshot', async () => {
//     const state = {
//       orm: ormSession.state,
//       pending: { FETCH_CURRENT_USER },
//       session: {
//         signupInProgress: false
//       },
//     }
//     const { toJSON } = render(
//       <Provider store={createMockStore(state)}>
//         <RootView />
//       </Provider>
//     )
//     expect(toJSON()).toMatchSnapshot()
//   })

//   it('no loading indicator when signupInProgress - matches snapshot', async () => {
//     const state = {
//       orm: ormSession.state,
//       pending: { FETCH_CURRENT_USER },
//       session: {
//         signupInProgress: false
//       }
//     }
//     const { toJSON } = render(
//       <Provider store={createMockStore(state)}>
//         <RootView />
//       </Provider>
//     )
//     expect(toJSON()).toMatchSnapshot()
//   })

//   it('signedIn and signupInProgress matches snapshot', async () => {
//     const state = {
//       ...getEmptyState(),
//       orm: ormSession.state,
//       session: {
//         signedIn: true,
//         signupInProgress: true
//       }
//     }
//     const { toJSON } = await render(
//       <Provider store={createMockStore(state)}>
//         <RootView />
//       </Provider>
//     )
//     await act(async () => {
//       expect(toJSON()).toMatchSnapshot()  
//     })
//   })

//   it('signedIn but not signupInProgress matches snapshot', async () => {
//     const state = {
//       ...getEmptyState(),
//       orm: ormSession.state,
//       session: {
//         signedIn: true
//       }
//     }
//     const { toJSON } = await render(
//       <Provider store={createMockStore(state)}>
//         <RootView />
//       </Provider>
//     )
//     await act(async () => {
//       expect(toJSON()).toMatchSnapshot()
//     })
//   })
// })
