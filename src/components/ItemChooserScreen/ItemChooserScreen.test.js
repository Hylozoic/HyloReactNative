import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ItemChooserScreen from './ItemChooserScreen'

it('renders as expected', () => {
  const items = [{ id: 'member1' }, { id: 'member2' }]
  const props = {
    style: {styleProp: 1},
    updateMembers: () => {},
    onCancel: () => {},
    navigation: {
      state: {
        params: {
          screenTitle: 'Screen Title',
          initialItems: items,
          ItemRowComponent: item => item.id,
          fetchSearchSuggestions: () => {},
          getSearchSuggestions: () => {}
        }
      },
      setParams: jest.fn(),
      getParam: jest.fn()
    }
  }

  const renderer = new ReactShallowRenderer()
  renderer.render(
    <ItemChooserScreen {...props} />
  )
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
