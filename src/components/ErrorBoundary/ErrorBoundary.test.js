import { Text, Image, View } from 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import ErrorBoundary from './ErrorBoundary'

it('matches last snapshot', () => {
  const renderer = ReactTestRenderer.create(<ErrorBoundary>
    <Text>Happy Child</Text>
  </ErrorBoundary>)
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('displays an error when a child component throws an error', () => {
  const renderer = ReactTestRenderer.create(<ErrorBoundary>
    <BuggyComponent />
  </ErrorBoundary>)
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('displays a custom error when a child component throws an error', () => {
  const renderer = ReactTestRenderer.create(<ErrorBoundary>
    <Text>Happy Child</Text>
    <ErrorBoundary customErrorUI={<CustomErrorComponent />}>
      <BuggyComponent />
    </ErrorBoundary>
  </ErrorBoundary>)
  expect(renderer.toJSON()).toMatchSnapshot()
})

function BuggyComponent () {
  throw new Error('I Crashed')
}

function CustomErrorComponent () {
  return <View>
    <Image />
    <Text>Custom Error Message</Text>
  </View>
}
