import React from 'react'
import { Provider } from 'react-redux'
import { render, waitFor } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import getEmptyState from 'store/getEmptyState'
import MemberProfile from 'screens/MemberProfile'

jest.mock('hooks/useGroupSelect')

describe('MemberProfile Specification', () => {
  it('default render matches snapshot', async () => {
    const navigation = {
      navigate: jest.fn(),
      setOptions: jest.fn()
    }
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <MemberProfile navigation={navigation} route={{ name: 'test' }} />
      </Provider>
    )

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot()
    })
  })
})
