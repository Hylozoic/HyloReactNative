import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import PostEditor, { SectionLabel, TypeButton } from './PostEditor'
import { TouchableOpacity } from 'react-native'

jest.mock('react-native-device-info')

describe('PostEditor', () => {
  it('renders a new editor correctly', () => {
    const save = jest.fn(() => Promise.resolve())

    const renderer = new ReactShallowRenderer()
    renderer.render(<PostEditor
      save={save}
      editDetails={jest.fn()}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('presses buttons', () => {
    const navigation = {setParams: jest.fn()}
    const save = jest.fn(() => Promise.resolve())
    const editDetails = jest.fn()
    const renderer = TestRenderer.create(<PostEditor
      editDetails={editDetails}
      setDetails={jest.fn()}
      save={save}
      navigation={navigation}
      post={{details: 'myDetails', communities: [{id: 1}]}}
    />)

    const root = renderer.root

    // Discussion type button
    root.findAllByType(TypeButton)[0].props.onPress()
    expect(root.instance.state.type).toBe('discussion')

    // request type button
    root.findAllByType(TypeButton)[1].props.onPress()
    expect(root.instance.state.type).toBe('request')

    // Offer type button
    root.findAllByType(TypeButton)[2].props.onPress()
    expect(root.instance.state.type).toBe('offer')

    // details section
    expect(editDetails).not.toHaveBeenCalled()
    root.findAllByType(TouchableOpacity)[3].props.onPress()
    expect(editDetails).toHaveBeenCalled()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {headerTitle: 'a title', save: jest.fn(), isSaving: false}}}}
    expect(PostEditor.navigationOptions(props)).toMatchSnapshot()
  })

  it('renders correctly while saving', () => {
    const navigation = {setParams: jest.fn()}
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(<PostEditor
      editDetails={jest.fn()}
      setDetails={jest.fn()}
      save={save}
      navigation={navigation}
      post={{details: 'myDetails', communities: [{id: 1}]}}
    />)

    expect(renderer.toJSON()).toMatchSnapshot()

    const instance = renderer.getInstance()

    instance.setState({type: 'request'})
    instance.saveEditor()

    expect(navigation.setParams).toHaveBeenCalledWith({isSaving: true})
    expect(save).toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()

    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('handles save rejections properly', async () => {
    expect.assertions(2)
    const navigation = {setParams: jest.fn()}
    const save = jest.fn(() => Promise.reject(new Error('invalid')))
    const renderer = TestRenderer.create(<PostEditor
      editDetails={jest.fn()}
      setDetails={jest.fn()}
      save={save}
      navigation={navigation}
      post={{details: 'myDetails', communities: [{id: 1}]}}
    />)

    const instance = renderer.getInstance()

    await instance.saveEditor()
    expect(navigation.setParams.mock.calls[1][0]).toHaveProperty('isSaving', true)
    expect(navigation.setParams.mock.calls[2][0]).toHaveProperty('isSaving', false)
  })
})

describe('SectionLabel', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SectionLabel>Label</SectionLabel>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('TypeButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const type = 'discussion'
    renderer.render(<TypeButton
      type={type}
      key={type}
      onPress={jest.fn()}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
