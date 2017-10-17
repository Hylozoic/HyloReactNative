import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
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

  it('has navigation options', () => {
    const props = {navigation: {}}
    expect(DetailsEditor.navigationOptions(props)).toMatchSnapshot()
  })
})
