import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import DetailsEditor from './DetailsEditor'

const navigation = {
  state: {
    params: {
      communityId: 1
    }
  }
}
describe('DetailsEditor', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const initialContent = 'initial content'
    renderer.render(<DetailsEditor
      initialContent={initialContent}
      saveChanges={jest.fn()}
      navigation={navigation}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('calls saveChanges on componentWillUnmount', () => {
    const initialContent = 'initial content'
    const saveChanges = jest.fn()
    const instance = TestRenderer.create(<DetailsEditor
      initialContent={initialContent}
      saveChanges={saveChanges}
      navigation={navigation}
    />).root.instance

    instance.componentWillUnmount()
    expect(saveChanges).toHaveBeenCalled()
  })
})
