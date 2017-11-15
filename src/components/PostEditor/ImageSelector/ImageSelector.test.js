import React from 'react'
import TestRenderer from 'react-test-renderer'
import ImageSelector from './index'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import PopupMenuButton from '../../PopupMenuButton'

jest.mock('util/platform', () => ({isIOS: true}))
jest.mock('../../PopupMenuButton', () => 'PopupMenuButtonMock')

let store

beforeEach(() => {
  store = createMockStore()
})

it('renders with no images', () => {
  const node = TestRenderer.create(<Provider store={store}>
    <ImageSelector />
  </Provider>)
  expect(node).toMatchSnapshot()
})

it('renders with images', () => {
  const node = TestRenderer.create(<Provider store={store}>
    <ImageSelector imageUrls={[
      'http://foo.com/foo.png',
      'http://bar.com/bar.png',
      'http://baz.com/baz.png'
    ]} />
  </Provider>)
  expect(node).toMatchSnapshot()
})

it('has an onRemove prop', () => {
  const onRemove = jest.fn()
  const node = TestRenderer.create(<Provider store={store}>
    <ImageSelector imageUrls={['http://foo.com/foo.png']}
      onRemove={onRemove} />
  </Provider>)

  node.root.findByType(PopupMenuButton).props.actions[0][1]()
  expect(onRemove).toHaveBeenCalledWith('http://foo.com/foo.png')
})
