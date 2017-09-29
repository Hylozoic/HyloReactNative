import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FlagContent from './FlagContent'

describe('FlagContent', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FlagContent visible={true}
      onClose={() => { }} />
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('changes title based on type', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FlagContent visible={true}
    type='post'
    onClose={() => { }} />
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
