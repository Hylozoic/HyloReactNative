import { Text, Image, View } from 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ErrorBoundary from './ErrorBoundary'
import * as Sentry from '@sentry/react-native'

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }))

beforeEach(() => {
  Sentry.captureException.mockReset()
})

const buggyError = new Error('I Crashed')

it('matches last snapshot', () => {
  const logError = jest.fn()
  const renderer = ReactTestRenderer.create(
    <ErrorBoundary logError={logError}>
      <Text>Happy Child</Text>
    </ErrorBoundary>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('displays an error when a child component throws an error', () => {
  const logError = jest.fn()
  const renderer = ReactTestRenderer.create(<ErrorBoundary logError={logError}>
    <BuggyComponent />
  </ErrorBoundary>)

  expect(Sentry.captureException).toHaveBeenCalled()
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('displays a custom error when a child component throws an error', () => {
  const logError = jest.fn()
  const renderer = ReactTestRenderer.create(<ErrorBoundary logError={logError}>
    <Text>Happy Child</Text>
    <ErrorBoundary customErrorUI={<CustomErrorComponent />} logError={logError}>
      <BuggyComponent />
    </ErrorBoundary>
  </ErrorBoundary>)

  expect(Sentry.captureException).toHaveBeenCalled()
  expect(renderer.toJSON()).toMatchSnapshot()
})

function BuggyComponent () {
  throw buggyError
}

function CustomErrorComponent () {
  return (
    <View>
      <Image />
      <Text>Custom Error Message</Text>
    </View>
  )
}
