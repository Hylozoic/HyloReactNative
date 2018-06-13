import React from 'react'
import InlineEditor, { SubmitButton, mentionsToHtml, createMentionTag, createTopicTag, getMarkup, toHtml } from './InlineEditor'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { SearchType } from '../Search'
import TestRenderer from 'react-test-renderer'

const props = {
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  value: 'some text',
  placeholder: `Place Holder`,
  communityId: 10
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

it('insertPicked', () => {
  const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  instance.setState({pickerType: SearchType.PERSON})
  instance.insertPicked({id: 333, name: 'sdfdfz'})
  expect(props.onChange).toHaveBeenCalledWith('some text [sdfdfz:333] ')
  expect(instance.state.showPicker).toBeFalsy()
})

it('handleInputFocus', () => {
  const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  instance.handleInputFocus()
  expect(instance.state.isFocused).toBeTruthy()
})

it('handleInputFocus', () => {
  const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  instance.cancelPicker()
  expect(instance.state.showPicker).toBeFalsy()
})

it('handleInputBlur', () => {
  const newProps = {
    ...props,
    value: '   '
  }
  const instance = TestRenderer.create(<InlineEditor {...newProps} />).getInstance()
  instance.setState({isFocused: true})
  instance.handleInputBlur()
  expect(instance.state.isFocused).toBeFalsy()
  expect(props.onChange).toHaveBeenCalledWith('')
})

it('toHtml', () => {
  const text = "hello world [tom:3344] [:5] #adlkjdf here's"
  expect(toHtml(text)).toEqual(`hello world <a href="#" data-entity-type="mention" data-user-id="3344">tom</a> [:5] #adlkjdf here&#39;s`)
})

it('getMarkup', () => {
  expect(getMarkup(SearchType.PERSON, {id: 30, name: 'tom'})).toEqual('[tom:30]')
  expect(getMarkup(SearchType.TOPIC, {name: 'mytopic'})).toEqual('#mytopic')
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
