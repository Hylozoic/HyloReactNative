import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import ItemChooser from './ItemChooser'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'

const state = {
  ItemChooser: {}
}

const items = [
  { id: 'member1' },
  { id: 'member2' }
]

const testProps = {
  updateMembers: () => {},
  onCancel: () => {},
  route: {
    params: {
      screenTitle: 'Screen Title',
      initialItems: items,
      ItemRowComponent: item => null,
      fetchSearchSuggestions: () => {
        return { type: 'test-search' }
      },
      getSearchSuggestions: () => items,
      updateItems: jest.fn()
    }
  },
  navigation: {
    setParams: jest.fn(),
    setOptions: jest.fn()
  }
}

// snapshot test difference between render of pick vs choose itemschooser?
// test for updateItems
// test that done for update Items and cancel do what are expected
// test that cancel does what is expected for pickItem
// test pickItem

describe('ItemChooser', () => {
  it('renders as expected', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore(state)}>
        <ItemChooser {...testProps} />
      </Provider>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
