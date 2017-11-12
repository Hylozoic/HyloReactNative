import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import PostEditor, { SectionLabel, TypeButton } from './PostEditor'
import { TouchableOpacity } from 'react-native'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'

jest.mock('react-native-device-info')

const mockPost = {
  details: 'myDetails'
}

describe('PostEditor', () => {
  let navigation

  beforeEach(() => {
    navigation = {setParams: jest.fn()}
  })

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

  it('renders with a post', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostEditor
      post={mockPost}
      imageUrls={[
        'http://foo.com/foo.png',
        'http://baz.com/baz.png'
      ]} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('presses buttons', () => {
    const save = jest.fn(() => Promise.resolve())
    const editDetails = jest.fn()
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          editDetails={editDetails}
          setDetails={jest.fn()}
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const root = renderer.root.findByType(PostEditor)

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
    const props = {
      navigation: {
        state: {
          params: {headerTitle: 'a title', save: jest.fn(), isSaving: false}
        }
      }
    }
    expect(PostEditor.navigationOptions(props)).toMatchSnapshot()
  })

  it('renders correctly while saving', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          editDetails={jest.fn()}
          setDetails={jest.fn()}
          save={save}
          communityIds={[1]}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    expect(renderer.toJSON()).toMatchSnapshot()

    const instance = renderer.root.findByType(PostEditor).instance
    instance.setState({type: 'request'})
    instance.save()

    expect(navigation.setParams).toHaveBeenCalledWith({isSaving: true})
    expect(save).toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()

    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('handles save rejections properly', async () => {
    expect.assertions(2)
    const save = jest.fn(() => Promise.reject(new Error('invalid')))
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          editDetails={jest.fn()}
          setDetails={jest.fn()}
          save={save}
          communityIds={[1]}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance

    await instance.save()
    expect(navigation.setParams.mock.calls[1][0]).toHaveProperty('isSaving', true)
    expect(navigation.setParams.mock.calls[2][0]).toHaveProperty('isSaving', false)
  })

  it('has image methods', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          editDetails={jest.fn()}
          setDetails={jest.fn()}
          navigation={navigation}
          imageUrls={['http://foo.com/foo.png']}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    instance.addImage({remote: 'http://bar.com/bar.png'})
    expect(instance.state.imageUrls).toEqual([
      'http://foo.com/foo.png',
      'http://bar.com/bar.png'
    ])

    instance.removeImage('http://foo.com/foo.png')
    expect(instance.state.imageUrls).toEqual([
      'http://bar.com/bar.png'
    ])
  })

  it('has file methods', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          editDetails={jest.fn()}
          setDetails={jest.fn()}
          navigation={navigation}
          fileUrls={['http://foo.com/foo.pdf']}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    instance.addFile({remote: 'http://bar.com/bar.pdf'})
    expect(instance.state.fileUrls).toEqual([
      'http://foo.com/foo.pdf',
      'http://bar.com/bar.pdf'
    ])

    instance.removeFile('http://foo.com/foo.pdf')
    expect(instance.state.fileUrls).toEqual([
      'http://bar.com/bar.pdf'
    ])
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
