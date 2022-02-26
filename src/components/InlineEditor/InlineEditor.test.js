import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import { render, fireEvent } from '@testing-library/react-native'
import { createMockStore, ReactNativeTestingLibraryRoot } from 'util/testing'
import InlineEditor, {
  SubmitButton,
  mentionsToHTML,
  createMentionTag,
  createTopicTag,
  toHTML
} from './InlineEditor'

const props = {
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  value: 'some value',
  placeholder: 'Placeholder Text',
  groupId: 10,
  route: {
    params: {}
  },
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn()
  }
}

const renderComponent = async (testProps = {}) => {
  return render(
    <ReactNativeTestingLibraryRoot>
      <InlineEditor {...props} {...testProps} />
    </ReactNativeTestingLibraryRoot>
  )
}

describe('mentions and topics', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('renders as expected', async () => {
    const { getByPlaceholderText, getByDisplayValue } = await renderComponent()
    expect(await getByPlaceholderText('Placeholder Text')).toBeTruthy()
    expect(await getByDisplayValue('some value')).toBeTruthy()
  })

  it('onChange is called', async () => {
    const onChangeMock = jest.fn()
    const { getByDisplayValue } = await renderComponent({ onChange: onChangeMock })
    const textInput = await getByDisplayValue(props.value)
    const newValue = 'new text value'
    fireEvent.changeText(textInput, newValue)
    expect(onChangeMock).toHaveBeenCalledWith(newValue)
  })

  it('onSubmit is called', async () => {
    const onSubmitMock = jest.fn()
    const { getByTestId } = await renderComponent({ onSubmit: onSubmitMock })
    await fireEvent.press(await getByTestId('submitButton'))
    expect(onSubmitMock).toHaveBeenCalledWith(props.value)
  })

  // it('inserts the markup for a mention', async () => {
  //   let currentValue
  //   const onChangeMock = jest.fn(value => { currentValue = value })
  //   const { getByTestId } = await renderComponent({ onChange: onChangeMock })
  //   // const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  //   // instance.handleSelectionChange({ nativeEvent: { selection: { start: 5, end: 5 } } })
  //   // instance.insertMention({ id: 333, name: 'sdfdfz' })
  //   await fireEvent.press(await getByTestId('mentionPicker'))
  //   expect(onChangeMock).toHaveBeenCalledWith('some [sdfdfz:333] text')
  // })

  // it('inserts the markup for a topic', () => {
  //   const onInsertTopic = jest.fn()
  //   const instance = TestRenderer.create(<InlineEditor {...props} onInsertTopic={onInsertTopic} />).getInstance()
  //   const topic = { id: 333, name: 'sdfdfz' }
  //   instance.insertTopic(topic)
  //   expect(props.onChange).toHaveBeenCalledWith('#sdfdfz some text')
  // })

  // it('handleFocus', () => {
  //   const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  //   instance.handleFocus()
  //   expect(instance.state.isFocused).toBeTruthy()
  // })

  // it('handleBlur', () => {
  //   const newProps = {
  //     ...props,
  //     value: '   '
  //   }
  //   const instance = TestRenderer.create(<InlineEditor {...newProps} />).getInstance()
  //   instance.setState({ isFocused: true })
  //   instance.handleBlur()
  //   expect(instance.state.isFocused).toBeFalsy()
  //   expect(props.onChange).toHaveBeenCalledWith('')
  // })
})

describe('SubmitButton', () => {
  it('renders SubmitButton when submitting', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SubmitButton submitting />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})

it('toHTML', () => {
  expect(toHTML(
    "hello world [tom](3344) [:5] #adlkjdf here's"
  )).toBe(
    '<p>hello world <a href="#" data-entity-type="mention" data-user-id="3344">tom</a> [:5] #adlkjdf here&#39;s</p>\n'
  )
})

it('createTopicTag', () => {
  expect(createTopicTag(
    { id: 333, name: 'topic' }
  )).toEqual(
    '#topic'
  )
})

it('createMentionTag', () => {
  expect(createMentionTag(
    { id: 30, name: 'tom' }
  )).toEqual(
    '[tom](30)'
  )
})

it('mentionsToHTML', () => {
  expect(mentionsToHTML(
    'hello [tom](333) [two](233) world [three](3332)'
  )).toEqual(
    'hello <a href="#" data-entity-type="mention" data-user-id="333">tom</a> <a href="#" data-entity-type="mention" data-user-id="233">two</a> world <a href="#" data-entity-type="mention" data-user-id="3332">three</a>'
  )
})
