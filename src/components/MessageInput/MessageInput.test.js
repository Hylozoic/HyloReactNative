import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MessageInput from './MessageInput'

it('matches the last snapshot', () => {
  const shallow = new ReactShallowRenderer()
  shallow.render(<MessageInput onSubmit={() => {}} placeholder='Wombats...' />)
  expect(shallow.getRenderOutput()).toMatchSnapshot()
})
