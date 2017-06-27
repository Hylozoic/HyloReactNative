import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Post from './index'

it('renders a Post', () => {
  const navigation = {
    state: {
      params: {
        post: {
          title: 'Wombat'
        }
      }
    }
  }
  const actual = renderer.create(<Post navigation={navigation} />)
  expect(actual).toMatchSnapshot()
})
