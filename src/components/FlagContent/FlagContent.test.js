import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FlagContent from './FlagContent'
import ConnectedFlagContent from './index'
import { Provider } from 'react-redux';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state })
});

describe('FlagContent', () => {
  it('doesnt blow up', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<Provider store={storeFake}><ConnectedFlagContent /></Provider>)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

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

  it('calls onClose successfully', () => {
    const onClose = jest.fn()
    const instance = TestRenderer.create(<FlagContent visible={true}
    type='post'
    onClose={onClose} />
    ).root.instance

    instance.closeModal()

    expect(onClose).toHaveBeenCalled()
  })

  it('calls submit successfully with category:inappropriate', () => {
    const onClose = jest.fn()
    const submitFlagContent = jest.fn()

    const linkData = {id: 33, type: 'post'}
    const instance = TestRenderer.create(<FlagContent visible={true}
    type='post'
    linkData={linkData}
    submitFlagContent={submitFlagContent}
    onClose={onClose} />
    ).root.instance

    instance.setState({selectedCategory: 'inappropriate'})

    instance.submit('  my reason  ')

    expect(instance.isOptionalExplanation()).toBeTruthy()

    expect(submitFlagContent).toHaveBeenCalledWith('inappropriate', 'my reason', linkData)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls submit successfully with category:other', () => {
    const onClose = jest.fn()
    const submitFlagContent = jest.fn()

    const linkData = {id: 33, type: 'post'}
    const renderer = TestRenderer.create(<FlagContent visible={true}
    type='post'
    linkData={linkData}
    submitFlagContent={submitFlagContent}
    onClose={onClose} />
    )

    expect(renderer.toJSON()).toMatchSnapshot()

    const instance = renderer.getInstance()

    instance.setState({selectedCategory: 'other'})

    expect(instance.isOptionalExplanation()).toBeFalsy()
    expect(instance.state.highlightRequired).toBeFalsy()

    instance.submit('  ')

    expect(submitFlagContent).not.toHaveBeenCalled()
    expect(instance.state.highlightRequired).toBeTruthy()

    instance.submit('  my reason  ')

    expect(submitFlagContent).toHaveBeenCalledWith('other', 'my reason', linkData)
    expect(onClose).toHaveBeenCalled()
  })
})
