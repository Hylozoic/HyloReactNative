import React from 'react'
import InlineEditor from './InlineEditor'
import ReactShallowRenderer from 'react-test-renderer/shallow'

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<InlineEditor onChange={() => jest.fn()}
    onSubmit={() => jest.fn()}
    value={'some text'}
    placeholder={`Place Holder`}
    communityId={10} />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
