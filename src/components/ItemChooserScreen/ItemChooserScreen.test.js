import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import ItemChooserScreen from './ItemChooserScreen'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'

const state = {
  querySearchTerms: {}
}

const items = [
  { id: 'member1' },
  { id: 'member2' }
]

const testProps = {
  updateMembers: () => {},
  onCancel: () => {},
  navigation: {
    state: {
      params: {
        screenTitle: 'Screen Title',
        initialItems: items,
        ItemRowComponent: item => item.id,
        fetchSearchSuggestions: () => {
          return { type: 'test-search' } 
        },
        getSearchSuggestions: () => items,
        updateItems: jest.fn()
      }
    },
    setParams: jest.fn(),
    getParam: jest.fn()
  }
}

// snapshot test difference between render of pick vs choose itemschooser?
// test for updateItems
// test that done for update Items and cancel do what are expected
// test that cancel does what is expected for pickItem
// test pickItem

describe('ItemChooserScreen', () => {
  it('renders as expected', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore(state)}>
        <ItemChooserScreen {...testProps} />
      </Provider>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
