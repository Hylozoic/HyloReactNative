import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityReview from './CreateCommunityReview'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateCommunityReview />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when visible is true', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityReview />)
  const instance = renderer.getInstance()
  instance.setState({ error: 'This is an error' })
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('calls createCommunity on submit', () => {
  const result = {
    payload: {
      data: {
        createCommunity: {
          community: {
            id: 1
          }
        }
      }
    }
  }

  const props = {
    createCommunity: jest.fn(() => Promise.resolve(result)),
    clearNameAndUrlFromStore: jest.fn(),
    goToCommunity: jest.fn()
  }
  const communityName = 'communityName'
  const communityUrl = 'communityUrl'
  const renderer = ReactTestRenderer.create(<CreateCommunityReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityName,
    communityUrl
  })
  return instance.submit()
    .then(() => {
      expect(props.createCommunity).toHaveBeenCalledWith(communityName, communityUrl)
      expect(props.clearNameAndUrlFromStore).toHaveBeenCalled()
      expect(props.goToCommunity).toHaveBeenCalledWith(result.payload.data.createCommunity.community)
    })
})

it('creates an error on submit if an error is returned', () => {
  const result = {
    error: 'some error'
  }
  const props = {
    createCommunity: jest.fn(() => Promise.resolve(result)),
    clearNameAndUrlFromStore: jest.fn(),
    goToCommunity: jest.fn()
  }
  const communityName = 'communityName'
  const communityUrl = 'communityUrl'
  const renderer = ReactTestRenderer.create(<CreateCommunityReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityName,
    communityUrl
  })
  return instance.submit()
    .then(() => {
      expect(instance.state.error).toBeTruthy()
    })
})

it('creates an error on submit if the promise is rejected', () => {
  const props = {
    createCommunity: jest.fn(() => Promise.reject(new Error(''))),
    clearNameAndUrlFromStore: jest.fn(),
    goToCommunity: jest.fn()
  }
  const communityName = 'communityName'
  const communityUrl = 'communityUrl'
  const renderer = ReactTestRenderer.create(<CreateCommunityReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityName,
    communityUrl
  })
  return instance.submit()
    .then(() => {
      expect(instance.state.error).toBeTruthy()
    })
})
