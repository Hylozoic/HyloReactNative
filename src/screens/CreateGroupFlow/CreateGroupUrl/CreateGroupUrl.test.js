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
  const groupSlug = 'groupSlug'
  const props = { groupData: { slug: groupSlug } }
  const renderer = ReactTestRenderer.create(<CreateGroupUrl {...props} />)
  const instance = renderer.getInstance()
  expect(instance.state.slug).toEqual(groupSlug)
})

it('validates the url', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupUrl />)
  const instance = renderer.getInstance()

  let groupSlug = ''
  instance.validate(groupSlug)
  expect(renderer.toJSON()).toMatchSnapshot()

  groupSlug = 'symbols-fail-regex-*^%'
  instance.validate(groupSlug)
  expect(renderer.toJSON()).toMatchSnapshot()

  groupSlug = 'passing-url'
  expect(instance.validate(groupSlug)).toBeTruthy()
})

it('calls fetchGroupExists on checkAndSubmit', () => {
  const groupSlug = 'passing-url'
  const props = {
    groupData: { slug: groupSlug },
    fetchGroupExists: jest.fn(() => Promise.resolve({}))
  }
  const renderer = ReactTestRenderer.create(<CreateGroupUrl {...props} />)
  const instance = renderer.getInstance()
  instance.setState({ slug: groupSlug })
  instance.checkAndSubmit()
  expect(props.fetchGroupExists).toHaveBeenCalledWith(groupSlug)
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
    const updateGroupData = jest.fn()

    const groupSlug = 'group-url'

    return checkGroupUrlThenRedirect(
      groupSlug,
      fetchGroupExists,
      setErrorMessage,
      updateGroupData,
      goToCreateGroupReview
    ).then(() => {
      expect(updateGroupData).toHaveBeenCalledWith({ slug: groupSlug })
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
