import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityReview from './CreateCommunityReview'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')
jest.mock('react-native-device-info')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateCommunityReview />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when visible is true', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityReview />)
  const instance = renderer.getInstance()
  instance.setState({error: 'This is an error'})
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('calls createCommunity on submit', () => {
  const props = {
    createCommunity: jest.fn(() => Promise.resolve({}))
  }
  const communityName = 'communityName'
  const communityUrl = 'communityUrl'
  const renderer = ReactTestRenderer.create(<CreateCommunityReview {...props} />)
  const instance = renderer.getInstance()
  instance.setState({
    communityName,
    communityUrl
  })
  instance.submit()
  expect(props.createCommunity).toHaveBeenCalledWith(communityName, communityUrl)
})

it('has navigationOptions', () => {
  const navigation = jest.fn()
  expect(CreateCommunityReview.navigationOptions(navigation)).toMatchSnapshot()
})
