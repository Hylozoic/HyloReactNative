import {TouchableOpacity} from 'react-native'
import TestRenderer from 'react-test-renderer'
import Header from './index'

describe('headerRight', () => {
  it('goes to new message page', () => {
    const navigation = {
      navigate: jest.fn()
    }
    const renderer = TestRenderer.create(Header(navigation).headerRight)
    expect(renderer.toJSON()).toMatchSnapshot()
    const { root } = renderer
    root.findByType(TouchableOpacity).props.onPress()
    expect(navigation.navigate).toBeCalledWith('NewMessage')
  })
})
