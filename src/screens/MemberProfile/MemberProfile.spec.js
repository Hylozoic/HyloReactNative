import React from 'react'
import { Provider } from 'react-redux'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import { createInitialState } from 'store'
import MemberProfile from 'screens/MemberProfile'

jest.mock('hooks/useGroupSelect')

describe('MemberProfile Specification', () => {
  afterEach(cleanup)

  it('default render matches snapshot', async () => {
    const navigation = {
      navigate: jest.fn(),
      setOptions: jest.fn()
    }
    const state = createInitialState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <MemberProfile navigation={navigation} route={{ name: 'test' }} />
      </Provider>
    )

    expect(await toJSON()).toMatchSnapshot()
  })
})
