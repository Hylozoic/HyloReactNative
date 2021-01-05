import 'react-native'
import React from 'react'
import JoinCommunity from './JoinCommunity'
import { createMockStore } from 'util/testing'
import { Provider } from 'react-redux'
import { act } from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { navigate } from 'navigation/RootNavigation'
import { checkInvitation as checkInvitationAction, useInvitation } from './JoinCommunity.store'

jest.mock('navigation/RootNavigation')
jest.mock('./JoinCommunity.store')
jest.mock('screens/LoadingScreen', () => 'LoadingScreen')

it('calls useInvitation', async () => {
  let rendered
  const props = {
    route: { params: {} },
    navigation: {}
  }
  const state = {
    session: {
      signedIn: false
    }
  }
  const component = (
    <Provider store={createMockStore(state)}>
      <NavigationContainer>
        <JoinCommunity {...props} />
      </NavigationContainer>
    </Provider>
  )
  const { toJSON } = render(component)

  await act(async () => {
    rendered = toJSON()
  })

  expect(rendered).toMatchSnapshot()  
  expect(navigate).toHaveBeenCalledWith('Login')
})
