import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityUrl, { checkCommunityUrlThenRedirect } from './CreateCommunityUrl'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateCommunityUrl />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when there is an error', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl />)
  const instance = renderer.getInstance()
  instance.setState({ error: 'This is an error' })
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('clears error from state with clearErrors', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl />)
  const instance = renderer.getInstance()
  const error = 'some error'
  instance.setState({ error })
  instance.clearErrors()
  expect(instance.state.error).toBeNull()
})

it('updates state with setInput', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl />)
  const instance = renderer.getInstance()
  const key = 'key'
  const value = 'value'
  instance.setInput(key, value)
  instance.clearErrors()
  expect(instance.state[key]).toEqual(value)
})

it('sets the initial state with the initial communityUrl prop value', () => {
  const communityUrl = 'communityUrl'
  const props = {
    communityUrl
  }
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl {...props} />)
  const instance = renderer.getInstance()
  expect(instance.state.communityUrl).toEqual(communityUrl)
})

it('validates the url', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl />)
  const instance = renderer.getInstance()

  let communityUrl = ''
  instance.validate(communityUrl)
  expect(renderer.toJSON()).toMatchSnapshot()

  communityUrl = 'symbols-fail-regex-*^%'
  instance.validate(communityUrl)
  expect(renderer.toJSON()).toMatchSnapshot()

  communityUrl = 'passing-url'
  expect(instance.validate(communityUrl)).toBeTruthy()
})

it('calls fetchCommunityExists on checkAndSubmit', () => {
  const props = {
    fetchCommunityExists: jest.fn(() => Promise.resolve({}))
  }
  const communityUrl = 'passing-url'
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityUrl
  })
  instance.checkAndSubmit()
  expect(props.fetchCommunityExists).toHaveBeenCalledWith(communityUrl)
})

it('does not call fetchCommunityExists on checkAndSubmit with malformed url', () => {
  const props = {
    fetchCommunityExists: jest.fn(() => Promise.resolve({}))
  }
  const communityUrl = 'malformed-url-@$#%$#^#'
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityUrl
  })
  instance.checkAndSubmit()
  expect(props.fetchCommunityExists).toHaveBeenCalledTimes(0)
})

describe('checkCommunityUrlThenRedirect', () => {
  it('stores the community url and redirects with appropriate url', () => {
    const result = {
      payload: {
        data: {
          communityExists: {
            exists: false
          }
        }
      }
    }
    const fetchCommunityExists = jest.fn(() => Promise.resolve(result))
    const goToCreateCommunityReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveCommunityUrl = jest.fn()

    const communityUrl = 'community-url'

    return checkCommunityUrlThenRedirect(
      communityUrl,
      fetchCommunityExists,
      setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    ).then(() => {
      expect(saveCommunityUrl).toHaveBeenCalledWith(communityUrl)
      expect(goToCreateCommunityReview).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage on error', () => {
    const result = {
      error: 'some error'
    }
    const fetchCommunityExists = jest.fn(() => Promise.resolve(result))
    const goToCreateCommunityReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveCommunityUrl = jest.fn()

    const communityUrl = 'community-url'

    return checkCommunityUrlThenRedirect(
      communityUrl,
      fetchCommunityExists,
      setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage if the community exists', () => {
    const result = {
      payload: {
        data: {
          communityExists: {
            exists: true
          }
        }
      }
    }
    const fetchCommunityExists = jest.fn(() => Promise.resolve(result))
    const goToCreateCommunityReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveCommunityUrl = jest.fn()

    const communityUrl = 'community-url'

    return checkCommunityUrlThenRedirect(
      communityUrl,
      fetchCommunityExists,
      setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage with a malformed payload', () => {
    const result = {
      payload: {
        malformed: {
          data: {
            equals: true
          }
        }
      }
    }
    const fetchCommunityExists = jest.fn(() => Promise.resolve(result))
    const goToCreateCommunityReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveCommunityUrl = jest.fn()

    const communityUrl = 'community-url'

    return checkCommunityUrlThenRedirect(
      communityUrl,
      fetchCommunityExists,
      setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage with a rejected promise', () => {
    const fetchCommunityExists = jest.fn(() => Promise.reject(new Error('')))
    const goToCreateCommunityReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveCommunityUrl = jest.fn()

    const communityUrl = 'community-url'

    return checkCommunityUrlThenRedirect(
      communityUrl,
      fetchCommunityExists,
      setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })
})
