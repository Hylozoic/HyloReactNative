import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer, { act } from 'react-test-renderer'
import { PostEditor, TypeSelector } from './PostEditor'
import { Alert } from 'react-native'
import { createInitialStateWithCurrentUser, TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { ModalHeader } from 'navigation/headers'
import HeaderRightButton from 'navigation/headers/HeaderRightButton'
// import { DocumentPicker } from 'react-native-document-picker'
// import RNImagePicker from 'react-native-image-picker'

jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn()
  }
})
// jest.mock('react-native-document-picker', () => {
//   let callback

//   return {
//     DocumentPicker: {
//       show: jest.fn((options, cb) => {
//         callback = cb
//       }),
//       finishShow: (err, result) => callback(err, result),
//       isCancel: jest.fn()
//     },
//     DocumentPickerUtil: {
//       allFiles: jest.fn()
//     }
//   }
// })
// jest.mock('react-native-image-picker')

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
        save={save}
      />
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

  it.only('renders correctly while saving', async () => {
    const { toJSON, queryByText, getByText, getByDisplayValue } = render(
      <TestRoot state={createInitialStateWithCurrentUser()}>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              fetchPost={jest.fn()}
              isFocused
              post={{ ...mockPost, title: 'test', id: 'tewst' }}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    // expect(toJSON()).toMatchSnapshot()
    fireEvent.press(queryByText('Save'))
    // await waitFor(() => getByText('Saving...'))
    // expect(toJSON()).toMatchSnapshot()
    expect(getByDisplayValue('myDetails')).toEqual(true)
    // const instance = renderer.root.findByType(PostEditor).instance
    // await act(async () => {
    //   await instance.setState({ type: 'request' })
    //   await instance.handleSave()
    // })
    // expect(instance.state.isSaving).toBeTruthy()
    // expect(toJSON()).toMatchSnapshot()
  })

  it('calls alert when announcementEnabled', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              fetchPost={jest.fn()}
              isFocused
              save={save}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.setState({ type: 'request', announcementEnabled: true })
      await instance.handleSave()
    })
    expect(Alert.alert).toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(instance.state.isSaving).toBeTruthy()
  })

  it('toggles announcement', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              fetchPost={jest.fn()}
              isFocused
              save={save}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
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
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              isFocused
              fetchPost={jest.fn()}
              imageUrls={['http://foo.com/foo.png']}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.handleAddImage({ remote: 'http://bar.com/bar.png' })
    })
    expect(instance.state.imageUrls).toEqual([
      'http://foo.com/foo.png',
      'http://bar.com/bar.png'
    ])

    instance.handleRemoveImage('http://foo.com/foo.png')
    expect(instance.state.imageUrls).toEqual([
      'http://bar.com/bar.png'
    ])
  })

  it('showsAlert', async () => {
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              isFocused
              fetchPost={jest.fn()}
              imageUrls={['http://foo.com/foo.png']}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.showAlert('alert message')
    })
    expect(Alert.alert).toHaveBeenCalledWith('alert message')
  })

  it('has file methods', async () => {
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              isFocused
              fetchPost={jest.fn()}
              postId={mockPost.id}
              fileUrls={['http://foo.com/foo.pdf']}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )

    const instance = renderer.root.findByType(PostEditor).instance
    await act(async () => {
      await instance.handleAddFile({ remote: 'http://bar.com/bar.pdf' })
    })
    expect(instance.state.fileUrls).toEqual([
      'http://foo.com/foo.pdf',
      'http://bar.com/bar.pdf'
    ])
    await act(async () => {
      await instance.handleRemoveFile('http://foo.com/foo.pdf')
    })
    expect(instance.state.fileUrls).toEqual([
      'http://bar.com/bar.pdf'
    ])
  })

  it('updates the title', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              fetchPost={jest.fn()}
              isFocused
              save={save}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    const someTitle = 'some title'
    await act(async () => {
      await instance.handleUpdateTitle(someTitle)
    })
    expect(instance.state.title).toEqual(someTitle)
    expect(instance.state.titleLengthError).toBeFalsy()
  })

  it('displays an error if the title is too long', async () => {
    const save = jest.fn(() => Promise.resolve())
    const renderer = TestRenderer.create(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <PostEditor
              fetchPost={jest.fn()}
              isFocused
              save={save}
              post={mockPost}
              {...screenProps}
            />
          )}
        </MockedScreen>
      </TestRoot>
    )
    const instance = renderer.root.findByType(PostEditor).instance
    const longTitle = 'longTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitlelongTitle'
    await act(async () => {
      await instance.handleUpdateTitle(longTitle)
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
