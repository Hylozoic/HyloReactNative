import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateGroupUrl, { checkGroupUrlThenRedirect } from './CreateGroupUrl'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateGroupUrl />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when there is an error', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupUrl />)
  const instance = renderer.getInstance()
  instance.setState({ error: 'This is an error' })
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('clears error from state with clearErrors', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupUrl />)
  const instance = renderer.getInstance()
  const error = 'some error'
  instance.setState({ error })
  instance.clearErrors()
  expect(instance.state.error).toBeNull()
})

it('updates state with setInput', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupUrl />)
  const instance = renderer.getInstance()
  const key = 'key'
  const value = 'value'
  instance.setInput(key, value)
  instance.clearErrors()
  expect(instance.state[key]).toEqual(value)
})

it('sets the initial state with the initial groupUrl prop value', () => {
  const groupUrl = 'groupUrl'
  const props = {
    groupUrl
  }
  const renderer = ReactTestRenderer.create(<CreateGroupUrl {...props} />)
  const instance = renderer.getInstance()
  expect(instance.state.groupUrl).toEqual(groupUrl)
})

it('validates the url', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupUrl />)
  const instance = renderer.getInstance()

  let groupUrl = ''
  instance.validate(groupUrl)
  expect(renderer.toJSON()).toMatchSnapshot()

  groupUrl = 'symbols-fail-regex-*^%'
  instance.validate(groupUrl)
  expect(renderer.toJSON()).toMatchSnapshot()

  groupUrl = 'passing-url'
  expect(instance.validate(groupUrl)).toBeTruthy()
})

it('calls fetchGroupExists on checkAndSubmit', () => {
  const props = {
    fetchGroupExists: jest.fn(() => Promise.resolve({}))
  }
  const groupUrl = 'passing-url'
  const renderer = ReactTestRenderer.create(<CreateGroupUrl {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    groupUrl
  })
  instance.checkAndSubmit()
  expect(props.fetchGroupExists).toHaveBeenCalledWith(groupUrl)
})

it('does not call fetchGroupExists on checkAndSubmit with malformed url', () => {
  const props = {
    fetchGroupExists: jest.fn(() => Promise.resolve({}))
  }
  const groupUrl = 'malformed-url-@$#%$#^#'
  const renderer = ReactTestRenderer.create(<CreateGroupUrl {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    groupUrl
  })
  instance.checkAndSubmit()
  expect(props.fetchGroupExists).toHaveBeenCalledTimes(0)
})

describe('checkGroupUrlThenRedirect', () => {
  it('stores the group url and redirects with appropriate url', () => {
    const result = {
      payload: {
        data: {
          groupExists: {
            exists: false
          }
        }
      }
    }
    const fetchGroupExists = jest.fn(() => Promise.resolve(result))
    const goToCreateGroupReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveGroupUrl = jest.fn()

    const groupUrl = 'group-url'

    return checkGroupUrlThenRedirect(
      groupUrl,
      fetchGroupExists,
      setErrorMessage,
      saveGroupUrl,
      goToCreateGroupReview
    ).then(() => {
      expect(saveGroupUrl).toHaveBeenCalledWith(groupUrl)
      expect(goToCreateGroupReview).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage on error', () => {
    const result = {
      error: 'some error'
    }
    const fetchGroupExists = jest.fn(() => Promise.resolve(result))
    const goToCreateGroupReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveGroupUrl = jest.fn()

    const groupUrl = 'group-url'

    return checkGroupUrlThenRedirect(
      groupUrl,
      fetchGroupExists,
      setErrorMessage,
      saveGroupUrl,
      goToCreateGroupReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage if the group exists', () => {
    const result = {
      payload: {
        data: {
          groupExists: {
            exists: true
          }
        }
      }
    }
    const fetchGroupExists = jest.fn(() => Promise.resolve(result))
    const goToCreateGroupReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveGroupUrl = jest.fn()

    const groupUrl = 'group-url'

    return checkGroupUrlThenRedirect(
      groupUrl,
      fetchGroupExists,
      setErrorMessage,
      saveGroupUrl,
      goToCreateGroupReview
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
    const fetchGroupExists = jest.fn(() => Promise.resolve(result))
    const goToCreateGroupReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveGroupUrl = jest.fn()

    const groupUrl = 'group-url'

    return checkGroupUrlThenRedirect(
      groupUrl,
      fetchGroupExists,
      setErrorMessage,
      saveGroupUrl,
      goToCreateGroupReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })

  it('calls setErrorMessage with a rejected promise', () => {
    const fetchGroupExists = jest.fn(() => Promise.reject(new Error('')))
    const goToCreateGroupReview = jest.fn()
    const setErrorMessage = jest.fn()
    const saveGroupUrl = jest.fn()

    const groupUrl = 'group-url'

    return checkGroupUrlThenRedirect(
      groupUrl,
      fetchGroupExists,
      setErrorMessage,
      saveGroupUrl,
      goToCreateGroupReview
    ).then(() => {
      expect(setErrorMessage).toHaveBeenCalled()
    })
  })
})
