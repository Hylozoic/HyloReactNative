import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import {
  InlineEditor,
  SubmitButton,
  mentionsToHtml,
  createMentionTag,
  createTopicTag,
  toHtml
} from './InlineEditor'

const props = {
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  value: 'some text',
  placeholder: `Place Holder`,
  communityId: 10,
  route: {
    params: {}
  },
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn()
  }
}

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<InlineEditor {...props} />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})

it('handleSubmit', () => {
  const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  instance.handleSubmit()
  expect(props.onSubmit).toHaveBeenCalledWith(props.value)
})

describe('mentions and topics', () => {
  it('inserts the markup for a mention', () => {
    const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
    instance._onSelectionChange({ nativeEvent: { selection: {start: 5, end: 5} } })
    instance.insertMention({ id: 333, name: 'sdfdfz' })
    expect(props.onChange).toHaveBeenCalledWith('some [sdfdfz:333] text')
  })

  it('inserts the markup for a topic', () => {
    const onInsertTopic = jest.fn()
    const instance = TestRenderer.create(<InlineEditor {...props} onInsertTopic={onInsertTopic} />).getInstance()
    const topic = {id: 333, name: 'sdfdfz'}
    instance.insertTopic(topic)
    expect(props.onChange).toHaveBeenCalledWith('#sdfdfz some text')
  })
})

it('_onFocus', () => {
  const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  instance._onFocus()
  expect(instance.state.isFocused).toBeTruthy()
})

it('_onBlur', () => {
  const newProps = {
    ...props,
    value: '   '
  }
  const instance = TestRenderer.create(<InlineEditor {...newProps} />).getInstance()
  instance.setState({isFocused: true})
  instance._onBlur()
  expect(instance.state.isFocused).toBeFalsy()
  expect(props.onChange).toHaveBeenCalledWith('')
})

it('toHtml', () => {
  const text = "hello world [tom:3344] [:5] #adlkjdf here's"
  expect(toHtml(text)).toEqual(`hello world <a href="#" data-entity-type="mention" data-user-id="3344">tom</a> [:5] #adlkjdf here&#39;s`)
})

it('createTopicTag', () => {
  expect(createTopicTag({id: 333, name: 'topic'})).toEqual('#topic')
})

it('createMentionTag', () => {
  expect(createMentionTag({id: 30, name: 'tom'})).toEqual('[tom:30]')
})

it('mentionsToHtml', () => {
  expect(mentionsToHtml('hello [tom:333] [two:233] world [three:3332]')).toEqual(`hello <a href="#" data-entity-type="mention" data-user-id="333">tom</a> <a href="#" data-entity-type="mention" data-user-id="233">two</a> world <a href="#" data-entity-type="mention" data-user-id="3332">three</a>`)
})

it('renders SubmitButton when submitting', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SubmitButton submitting />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
