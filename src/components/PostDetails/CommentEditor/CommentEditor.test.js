import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CommentEditor from './CommentEditor'
// This is currently broken because of an issue with react-native and jest
jest.mock('react-native-device-info')
jest.mock('../../Editor', () => 'Editor')

it('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  const navigation = {
    state: {
      params: {
        communityId: 1
      }
    }
  }
  renderer.render(<CommentEditor
    content={'lalala'}
    navigation={navigation}
  />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('has navigation options', () => {
  const props = {navigation: {state: {params: {}}}}
  expect(CommentEditor.navigationOptions(props)).toMatchSnapshot()
})

describe('save', () => {
  const navigation = {
    setParams: jest.fn(),
    state: {params: {}},
    goBack: jest.fn()
  }
  const saveChanges = jest.fn()
  const setCommentEdits = () => {}
  const props = {
    navigation,
    saveChanges,
    setCommentEdits
  }
  it('sets disabled to true and calls save changes with content', () => {
    const theContent = 'the content'
    const instance = ReactTestRenderer.create(<CommentEditor {...props} />).getInstance()
    instance.editor = {
      getContentAsync: () => Promise.resolve(theContent)
    }
    const { save } = navigation.setParams.mock.calls[0][0]
    navigation.setParams.mockClear()
    return save()
    .then(() => {
      expect(navigation.setParams).toHaveBeenCalledWith({disabled: true})
      expect(saveChanges).toHaveBeenCalledWith(theContent)
      expect(navigation.goBack).toHaveBeenCalled()
    })
  })
})

describe('componentDidUpdate', () => {
  const setParams = jest.fn()
  const notPendingProps = {
    pending: false,
    navigation: {
      setParams,
      state: {params: {}}
    }
  }
  const pendingProps = {
    ...notPendingProps,
    pending: true
  }

  it('sets disabled when pending changes to true', () => {
    const instance = ReactTestRenderer.create(<CommentEditor {...pendingProps} />).getInstance()
    setParams.mockClear()
    instance.componentDidUpdate(notPendingProps)
    expect(setParams).toHaveBeenCalledWith({disabled: true})
  })

  it('sets disabled to false when pending changes to false', () => {
    const setParams = jest.fn()
    const notPendingProps = {
      pending: false,
      navigation: {
        setParams,
        state: {params: {}}
      }
    }
    const pendingProps = {
      ...notPendingProps,
      pending: true
    }
    const instance = ReactTestRenderer.create(<CommentEditor {...notPendingProps} />).getInstance()
    setParams.mockClear()
    instance.componentDidUpdate(pendingProps)
    expect(setParams).toHaveBeenCalledWith({disabled: false})
  })
})
