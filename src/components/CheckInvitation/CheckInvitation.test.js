import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CheckInvitation from './CheckInvitation'

jest.mock('../Loading', () => 'Loading')
jest.mock('react-navigation', () => ({
  reset: () => {},
  navigate: () => {}
}))

const defaultRequiredProps = {
  pending: null,
  isValidInvite: null,
  checkInvitation: () => {}
}

function testPropsSetup (props = {}, required = defaultRequiredProps) {
  return {...required, ...props}
}

function shallowRender (props) {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CheckInvitation {...testPropsSetup(props)} />)
  return renderer
}

it('matches last snapshot - default', () => {
  const actual = shallowRender().getRenderOutput()
  expect(actual).toMatchSnapshot()
})

// Lifecycle Methods

test('componentDidMount', () => {
  const testProps = testPropsSetup({
    navigation: {
      navigate: jest.fn()
    },
    checkInvitation: jest.fn(() => Promise.reject(new Error('erroranything')))
  })
  // const instance = ReactTestRenderer.create(<CheckInvitation {...testProps} />).getInstance()
  return shallowRender(testProps)._instance.componentDidMount()
  .then(() => {
    expect(testProps.checkInvitation).toHaveBeenCalled()
    return expect(testProps.navigation.navigate).toHaveBeenCalled()
  })
})

// describe('componentWillUpdate', () => {
//   it('should fetchCurrentUser if loggedIn without a currentUser', () => {
//     const testProps = testPropsSetup({
//       pending: false,
//       loggedIn: true,
//       currentUser: null,
//       fetchCurrentUser: jest.fn()
//     })
//     const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
//     instance.componentWillUpdate(testProps)
//     expect(testProps.fetchCurrentUser).toHaveBeenCalled()
//   })
//
//   it('shouldn\'t fetchCurrentUser if loggedIn and there is a currentUser', () => {
//     const testProps = testPropsSetup({
//       pending: false,
//       loggedIn: true,
//       currentUser: {},
//       fetchCurrentUser: jest.fn()
//     })
//     const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
//     instance.componentWillUpdate(testProps)
//     expect(testProps.fetchCurrentUser).not.toHaveBeenCalled()
//   })
// })
//
// test('componentDidUpdate responds as expected', () => {
//   const testProps = testPropsSetup({
//     entryURL: 'anything',
//     loggedIn: true,
//     currentUser: {},
//     resetEntryURL: jest.fn()
//   })
//   const prevProps = testPropsSetup()
//   const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
//   const navigator = {
//     _handleOpenURL: jest.fn()
//   }
//   instance.navigator = navigator
//   instance.componentDidUpdate(prevProps)
//   expect(navigator._handleOpenURL).toHaveBeenCalledWith(testProps.entryURL)
//   expect(testProps.resetEntryURL).toHaveBeenCalled()
// })
//
// test('_handleOpenURL', () => {
//   const testProps = testPropsSetup({
//     setEntryURL: jest.fn()
//   })
//   const instance = ReactTestRenderer.create(<SessionCheck {...testProps} />).getInstance()
//   const url = '/any/path'
//   const navigator = {
//     _handleOpenURL: jest.fn()
//   }
//   instance.navigator = navigator
//   instance._handleOpenURL(url)
//   expect(testProps.setEntryURL).toHaveBeenCalledWith(url)
//   expect(navigator._handleOpenURL).toHaveBeenCalled()
// })
