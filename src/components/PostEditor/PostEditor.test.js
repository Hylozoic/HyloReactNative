import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import PostEditor, { SectionLabel, TypeButton } from './PostEditor'
import { Alert } from 'react-native'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import { DocumentPicker } from 'react-native-document-picker'
import RNImagePicker from 'react-native-image-picker'

jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn()
  }
})

jest.mock('react-native-document-picker', () => {
  let callback

  return {
    DocumentPicker: {
      show: jest.fn((options, cb) => {
        callback = cb
      }),
      finishShow: (err, result) => callback(err, result)
    },
    DocumentPickerUtil: {
      allFiles: jest.fn()
    }
  }
})

jest.mock('react-native-image-picker')

const mockPost = {
  details: 'myDetails',
  communities: [
    {id: 1, name: 'Community 1'}
  ]
}

describe('PostEditor', () => {
  let navigation

  beforeEach(() => {
    navigation = {
      setParams: jest.fn(),
      getParam: jest.fn()
    }
  })

  it('renders a new editor correctly', () => {
    const save = jest.fn(() => Promise.resolve())

    const renderer = new ReactShallowRenderer()
    renderer.render(<PostEditor
      navigation={navigation}
      save={save}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with a post', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostEditor
      navigation={navigation}
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
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          shouldShowTypeChooser
          fetchPost={jest.fn()}
          navigation={navigation}
          post={mockPost}
          save={save} />
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
  })

  it('has navigation options', () => {
    const props = {
      navigation: {
        setParams: jest.fn(),
        getParam: jest.fn(),
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
          fetchPost={jest.fn()}
          isFocused
          save={save}
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

  it('calls alert when announcementEnabled', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          fetchPost={jest.fn()}
          isFocused
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    instance.setState({type: 'request', announcementEnabled: true})
    instance.save()

    expect(Alert.alert).toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()
  })

  it('toggles announcement', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          fetchPost={jest.fn()}
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)
    jest.mock('util/toast', () => ({
      showToast: jest.fn(),
      hideToast: jest.fn()
    }))
    const instance = renderer.root.findByType(PostEditor).instance
    expect(instance.toast).not.toBeDefined()
    instance.toggleAnnoucement()
    expect(instance.toast).toBeDefined()
    expect(instance.state.announcementEnabled).toBeTruthy()
    instance.toggleAnnoucement()
    expect(instance.state.announcementEnabled).toBeFalsy()
  })

  it('handles save rejections properly', async () => {
    expect.assertions(2)
    const save = jest.fn(() => Promise.reject(new Error('invalid')))
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          fetchPost={jest.fn()}
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance

    await instance.save()
    expect(navigation.setParams.mock.calls[2][0]).toHaveProperty('isSaving', true)
    expect(navigation.setParams.mock.calls[3][0]).toHaveProperty('isSaving', false)
  })

  it('has image methods', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          fetchPost={jest.fn()}
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

  it('showsAlert', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          fetchPost={jest.fn()}
          navigation={navigation}
          imageUrls={['http://foo.com/foo.png']}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    instance.showAlert('alert message')
    expect(Alert.alert).toHaveBeenCalledWith('alert message')
  })

  it('_showFilePicker', async () => {
    const upload = jest.fn(() => Promise.resolve({
      payload: {
        url: 'https:/storage.hylo.com/foo.pdf'
      }
    }))
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          upload={upload}
          fetchPost={jest.fn()}
          fileUrls={[]}
          navigation={navigation}
          imageUrls={['http://foo.com/foo.png']}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    jest.spyOn(instance, 'addFile')
    instance._showFilePicker()
    expect(instance.state.filePickerPending).toBeTruthy()
    await DocumentPicker.finishShow(null, {
      uri: 'file:///somewhere/foo.pdf',
      fileName: 'foo.pdf',
      type: 'application/x-pdf'
    })
    expect(instance.state.filePickerPending).toBeFalsy()
    expect(upload).toHaveBeenCalled()
    expect(instance.addFile).toHaveBeenCalledWith({'local': 'file:///somewhere/foo.pdf', 'remote': 'https:/storage.hylo.com/foo.pdf'})
  })

  it('_showImagePicker', async () => {
    const upload = jest.fn(() => Promise.resolve({
      payload: {
        url: 'https:/storage.hylo.com/foo.pdf'
      }
    }))
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          upload={upload}
          fileUrls={[]}
          fetchPost={jest.fn()}
          navigation={navigation}
          imageUrls={['http://foo.com/foo.png']}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    jest.spyOn(instance, 'addImage')
    instance._showImagePicker()
    expect(instance.state.imagePickerPending).toBeTruthy()
    await RNImagePicker.finishImagePicker({
      uri: 'file:///tmp/bar.jpg',
      fileName: 'bar.jpg'
    })
    expect(instance.state.imagePickerPending).toBeFalsy()
    expect(upload).toHaveBeenCalled()
    expect(instance.addImage).toHaveBeenCalledWith({'local': 'file:///tmp/bar.jpg', 'remote': 'https:/storage.hylo.com/foo.pdf'})
  })

  it('has file methods', () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          isFocused
          fetchPost={jest.fn()}
          navigation={navigation}
          postId={mockPost.id}
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

  it('updates the title', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          fetchPost={jest.fn()}
          isFocused
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    const someTitle = 'some title'
    instance.updateTitle(someTitle)
    expect(instance.state.title).toEqual(someTitle)
    expect(instance.state.titleLengthError).toBeFalsy()
  })

  it('displays an error if the title is too long', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <PostEditor
          fetchPost={jest.fn()}
          isFocused
          save={save}
          navigation={navigation}
          post={mockPost} />
      </Provider>)

    const instance = renderer.root.findByType(PostEditor).instance
    const longTitle = 'longTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitle'
    instance.updateTitle(longTitle)
    expect(instance.state.titleLengthError).toBeTruthy()
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
