import NavigationContext from './NavigationContext'
import TestRenderer from 'react-test-renderer'
import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import DeepLinkHandler from '../DeepLinkHandler'

jest.mock('react-native-device-info')
jest.mock('../RootNavigator', () => 'RootNavigator')

const mockNavigator = {
  _handleOpenURL: jest.fn()
}

it('adds a method to context', async () => {
  const renderer = await TestRenderer.create(
    <Provider store={createMockStore()}>
      <NavigationContext />
    </Provider>)
  const node = renderer.root.findByType(NavigationContext)
  const { instance } = node

  instance.setup({
    getWrappedInstance: jest.fn(() => mockNavigator)
  })
  const { navigateToPath } = instance.state
  expect(navigateToPath).toBeTruthy()
  expect(instance.getChildContext()).toEqual({navigateToPath})

  const handler = node.findByType(DeepLinkHandler).instance
  expect(handler.props.navigator).toEqual(mockNavigator)

  navigateToPath('/foo')
  expect(mockNavigator._handleOpenURL).toHaveBeenCalledWith({
    url: 'hylo:///foo'
  })
})
