import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import PostEditor, { TypeSelector } from './PostEditor'
import { Alert } from 'react-native'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import { DocumentPicker } from 'react-native-document-picker'
import RNImagePicker from 'react-native-image-picker'
import { act } from 'react-test-renderer'

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
  groups: [
    { id: 1, name: 'Group 1' }
  ]
}

describe('PostEditor', () => {
  let route, navigation

  beforeEach(() => {
    route = {
      name: 'anything'
    }
    navigation = {
      isFocused: jest.fn(),
      setOptions: jest.fn(),
      setParams: jest.fn(),
      getParam: jest.fn()
    }
  })

  it('renders a new editor correctly', () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <PostEditor
        navigation={navigation}
        route={route}
        save={save} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders with a post', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <PostEditor
        navigation={navigation}
        route={route}
        post={mockPost}
        imageUrls={[
          'http://foo.com/foo.png',
          'http://baz.com/baz.png'
        ]}
      />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders correctly while saving', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            fetchPost={jest.fn()}
            isFocused
            save={save}
            navigation={navigation}
            route={route}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    expect(renderer.toJSON()).toMatchSnapshot()

    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.setState({ type: 'request' })
      await instance.save()
    })
    // TODO: Mock build header
    // expect(navigation.setOptions).toHaveBeenCalledTimes(2)
    // expect(navigation.setOptions).toHaveBeenCalledWith(expect.objectContaining({
    //   headerRightButtonDisabled: true
    // }))
    expect(save).toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('calls alert when announcementEnabled', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            fetchPost={jest.fn()}
            isFocused
            save={save}
            navigation={navigation}
            route={route}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.setState({ type: 'request', announcementEnabled: true })
      await instance.save()
    })
    expect(Alert.alert).toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()
  })

  it('toggles announcement', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            isFocused
            fetchPost={jest.fn()}
            save={save}
            navigation={navigation}
            route={route}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    jest.mock('util/toast', () => ({
      showToast: jest.fn(),
      hideToast: jest.fn()
    }))
    const instance = renderer.root.findByType(PostEditor).instance
    expect(instance.toast).not.toBeDefined()
    await act(async () => {
      await instance.toggleAnnoucement()
    })
    expect(instance.toast).toBeDefined()
    expect(instance.state.announcementEnabled).toBeTruthy()
    await act(async () => {
      await instance.toggleAnnoucement()
    })
    expect(instance.state.announcementEnabled).toBeFalsy()
  })

  it('has image methods', async () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            isFocused
            fetchPost={jest.fn()}
            navigation={navigation}
            route={route}
            imageUrls={['http://foo.com/foo.png']}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.addImage({ remote: 'http://bar.com/bar.png' })
    })
    expect(instance.state.imageUrls).toEqual([
      'http://foo.com/foo.png',
      'http://bar.com/bar.png'
    ])

    instance.removeImage('http://foo.com/foo.png')
    expect(instance.state.imageUrls).toEqual([
      'http://bar.com/bar.png'
    ])
  })

  it('showsAlert', async () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            isFocused
            fetchPost={jest.fn()}
            navigation={navigation}
            route={route}
            imageUrls={['http://foo.com/foo.png']}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.showAlert('alert message')
    })
    expect(Alert.alert).toHaveBeenCalledWith('alert message')
  })

  it('showFilePicker', async () => {
      const upload = jest.fn(() => Promise.resolve({
        payload: {
          url: 'https:/storage.hylo.com/foo.pdf'
        }
      }))
      const renderer = TestRenderer.create(
        <Provider store={createMockStore()}>
          <MockedScreen>
            {() => <PostEditor
              isFocused
              upload={upload}
              fetchPost={jest.fn()}
              fileUrls={[]}
              navigation={navigation}
              route={route}
              imageUrls={['http://foo.com/foo.png']}
              post={mockPost}
            />}
          </MockedScreen>
        </Provider>
      )
      const instance = renderer.root.findByType(PostEditor).instance
      jest.spyOn(instance, 'addFile')
      await act(async () => {
        await instance.showFilePicker()
      })
      expect(instance.state.filePickerPending).toBeTruthy()
      await act(async () => {
        await DocumentPicker.finishShow(null, {
          uri: 'file:///somewhere/foo.pdf',
          fileName: 'foo.pdf',
          type: 'application/x-pdf'
        })
      })
      expect(instance.state.filePickerPending).toBeFalsy()
      expect(upload).toHaveBeenCalled()
      expect(instance.addFile).toHaveBeenCalledWith({ local: 'file:///somewhere/foo.pdf', remote: 'https:/storage.hylo.com/foo.pdf' })
    // })
  })

  it('showImagePicker', async () => {
    const upload = jest.fn(() => Promise.resolve({
      payload: {
        url: 'https:/storage.hylo.com/foo.pdf'
      }
    }))
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            isFocused
            upload={upload}
            fileUrls={[]}
            fetchPost={jest.fn()}
            navigation={navigation}
            route={route}
            imageUrls={['http://foo.com/foo.png']}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    jest.spyOn(instance, 'addImage')
    await act(async () => {
      await instance.showImagePicker()
    })
    expect(instance.state.imagePickerPending).toBeTruthy()
    await act(async () => {
      await RNImagePicker.finishImagePicker({
        uri: 'file:///tmp/bar.jpg',
        fileName: 'bar.jpg'
      })
    })
    expect(instance.state.imagePickerPending).toBeFalsy()
    expect(upload).toHaveBeenCalled()
    expect(instance.addImage).toHaveBeenCalledWith({ local: 'file:///tmp/bar.jpg', remote: 'https:/storage.hylo.com/foo.pdf' })
  })

  it('has file methods', async () => {
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            isFocused
            fetchPost={jest.fn()}
            navigation={navigation}
            route={route}
            postId={mockPost.id}
            fileUrls={['http://foo.com/foo.pdf']}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )

    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.addFile({ remote: 'http://bar.com/bar.pdf' })
    })
    expect(instance.state.fileUrls).toEqual([
      'http://foo.com/foo.pdf',
      'http://bar.com/bar.pdf'
    ])
    await act(async () => {
      await instance.removeFile('http://foo.com/foo.pdf')
    })
    expect(instance.state.fileUrls).toEqual([
      'http://bar.com/bar.pdf'
    ])
  })

  it('updates the title', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            fetchPost={jest.fn()}
            isFocused
            save={save}
            navigation={navigation}
            route={route}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    const someTitle = 'some title'
    await act(async () => {
      await instance.updateTitle(someTitle)
    })
    expect(instance.state.title).toEqual(someTitle)
    expect(instance.state.titleLengthError).toBeFalsy()
  })

  it('displays an error if the title is too long', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <Provider store={createMockStore()}>
        <MockedScreen>
          {() => <PostEditor
            fetchPost={jest.fn()}
            isFocused
            save={save}
            navigation={navigation}
            route={route}
            post={mockPost}
          />}
        </MockedScreen>
      </Provider>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    const longTitle = 'longTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitle'
    await act(async () => {
      await instance.updateTitle(longTitle)
    })
    expect(instance.state.titleLengthError).toBeTruthy()
  })
})

describe('TypeButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const type = 'discussion'
    renderer.render(
      <TypeSelector value={type} onValueChange={jest.fn()} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
