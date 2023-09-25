import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer, { act } from 'react-test-renderer'
import { PostEditor, TypeSelector } from './PostEditor'
import { Alert } from 'react-native'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { createStackNavigator } from '@react-navigation/stack'

jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn()
  }
})

const mockPost = {
  details: 'myDetails',
  groups: [
    { id: 1, name: 'Group 1' }
  ]
}
const Stack = createStackNavigator()

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
        post={{
          ...mockPost,
          imageUrls: [
            'http://foo.com/foo.png',
            'http://baz.com/baz.png'
          ]
        }}
      />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  // Full React Native Testing Library + React Navigation example
  // helpful here for navigation.setOptions to update header buttons
  it('renders correctly while saving', async () => {
    const PostDetails = () => null
    const fetchPost = jest.fn()
    const component = (
      <TestRoot>
        <Stack.Navigator screenOptions={{ animationEnabled: false }}>
          <Stack.Screen name='MockedScreen'>
            {screenProps => (
              <PostEditor
                isFocused
                fetchPost={fetchPost}
                post={{
                  ...mockPost,
                  id: 'editing-post-id',
                  title: 'test',
                  type: 'discussion'
                }}
                updatePost={post => (
                  {
                    meta: {
                      extractModel: {
                        getRoot: r => r
                      }
                    },
                    payload: {
                      data: post
                    }
                  }
                )}
                {...screenProps}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name='Post Details' component={PostDetails} />
        </Stack.Navigator>
      </TestRoot>
    )
    const { getByText, getByPlaceholderText, toJSON } = render(component)
    fireEvent.changeText(
      getByPlaceholderText("What's on your mind?"),
      'title of this post'
    )
    fireEvent.press(getByText('Save'))

    await waitFor(() => {
      getByText('Saving...')
    })

    expect(fetchPost).toHaveBeenCalled()
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls alert when announcementEnabled', async () => {
    const save = jest.fn(() => Promise.resolve())
    let renderer
    await act(async () => {
      renderer = TestRenderer.create(
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
    })
    const root = renderer.root
    const component = root.findByType(PostEditor)
    const instance = component.instance

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
    let renderer
    await act(async () => {
      renderer = TestRenderer.create(
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
    })
    jest.mock('util/toast', () => ({
      showToast: jest.fn(),
      hideToast: jest.fn()
    }))
    const root = renderer.root
    const component = root.findByType(PostEditor)
    const instance = component.instance

    expect(instance.toast).not.toBeDefined()
    await act(async () => {
      await instance.handleToggleAnnouncement()
    })
    expect(instance.toast).toBeDefined()
    expect(instance.state.announcementEnabled).toBeTruthy()
    await act(async () => {
      await instance.handleToggleAnnouncement()
    })
    expect(instance.state.announcementEnabled).toBeFalsy()
  })

  it('has attachment methods', async () => {
    let renderer
    await act(async () => {
      renderer = TestRenderer.create(
        <TestRoot>
          <MockedScreen>
            {screenProps => (
              <PostEditor
                isFocused
                fetchPost={jest.fn()}
                post={mockPost}
                {...screenProps}
              />
            )}
          </MockedScreen>
        </TestRoot>
      )
    })
    const root = renderer.root
    const component = root.findByType(PostEditor)
    const instance = component.instance

    await act(async () => {
      await instance.handleAddAttachmentForKey('images')({ local: 'la', remote: 'http://foo.com/foo.png' })
      await instance.handleAddAttachmentForKey('images')({ local: 'lala', remote: 'http://bar.com/bar.png' })
    })

    expect(instance.state.images).toEqual([
      { local: 'la', remote: 'http://foo.com/foo.png' },
      { local: 'lala', remote: 'http://bar.com/bar.png' }
    ])

    act(() => instance.handleRemoveAttachmentForKey('images')({ local: 'la' }))

    expect(instance.state.images).toEqual([
      { local: 'lala', remote: 'http://bar.com/bar.png' }
    ])
  })

  it('displays an error if the title is too long', async () => {
    const save = jest.fn(() => Promise.resolve())
    let renderer
    await act(async () => {
      renderer = TestRenderer.create(
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
    })
    const root = renderer.root
    const component = root.findByType(PostEditor)
    const instance = component.instance
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

// TODO: Moved save from connector and these
// tests may be retrofit here
// it('calls save correctly', async () => {
//   expect.assertions(6)
//   const props = {
//     route: {
//       params: {
//         groupId,
//         id
//       }
//     },
//     navigation: {
//       navigate: jest.fn()
//     }
//   }
//   const dispatch = jest.fn(val => Promise.resolve(val))
//   const dispatchProps = mapDispatchToProps(dispatch, props)
//   expect(dispatchProps).toMatchSnapshot()

//   const postData = {
//     title: '',
//     groups: []
//   }

//   await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'Title cannot be blank')

//   postData.title = 'a title'
//   await expect(dispatchProps.save(postData)).rejects.toHaveProperty('message', 'You must select a group')

//   postData.groups = [{ id: 1 }]
//   await expect(dispatchProps.save(postData)).resolves.toBeDefined()

//   expect(dispatch).toHaveBeenCalled()
//   expect(dispatch.mock.calls).toMatchSnapshot()
// })
