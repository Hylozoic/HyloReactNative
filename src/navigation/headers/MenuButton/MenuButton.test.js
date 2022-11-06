import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import MenuButton from './MenuButton'
import MockedScreen from 'util/testing/MockedScreen'

describe('MenuButton', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <TestRoot>
        <MockedScreen>
          {screenProps => (
            <MenuButton {...screenProps} />
          )}
        </MockedScreen>
      </TestRoot>
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
