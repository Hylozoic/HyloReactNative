import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateGroupReview from './CreateGroupReview'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateGroupReview />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when visible is true', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupReview />)
  const instance = renderer.getInstance()
  instance.setState({ error: 'This is an error' })
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('calls createGroup on submit', () => {
  const result = {
    payload: {
      data: {
        createGroup: {
          group: {
            id: 1
          }
        }
      }
    }
  }

  const props = {
    createGroup: jest.fn(() => Promise.resolve(result)),
    clearNameAndUrlFromStore: jest.fn(),
    goToGroup: jest.fn()
  }
  const groupName = 'groupName'
  const groupUrl = 'groupUrl'
  const renderer = ReactTestRenderer.create(<CreateGroupReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    groupName,
    groupUrl
  })
  return instance.submit()
    .then(() => {
      expect(props.createGroup).toHaveBeenCalledWith(groupName, groupUrl)
      expect(props.clearNameAndUrlFromStore).toHaveBeenCalled()
      expect(props.goToGroup).toHaveBeenCalledWith(result.payload.data.createGroup.group)
    })
})

it('creates an error on submit if an error is returned', () => {
  const result = {
    error: 'some error'
  }
  const props = {
    createGroup: jest.fn(() => Promise.resolve(result)),
    clearNameAndUrlFromStore: jest.fn(),
    goToGroup: jest.fn()
  }
  const groupName = 'groupName'
  const groupUrl = 'groupUrl'
  const renderer = ReactTestRenderer.create(<CreateGroupReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    groupName,
    groupUrl
  })
  return instance.submit()
    .then(() => {
      expect(instance.state.error).toBeTruthy()
    })
})

it('creates an error on submit if the promise is rejected', () => {
  const props = {
    createGroup: jest.fn(() => Promise.reject(new Error(''))),
    clearNameAndUrlFromStore: jest.fn(),
    goToGroup: jest.fn()
  }
  const groupName = 'groupName'
  const groupUrl = 'groupUrl'
  const renderer = ReactTestRenderer.create(<CreateGroupReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    groupName,
    groupUrl
  })
  return instance.submit()
    .then(() => {
      expect(instance.state.error).toBeTruthy()
    })
})
