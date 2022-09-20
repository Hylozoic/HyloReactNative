import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
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

const renderComponent = (testProps = {}) => {
  return render(
    <TestRoot>
      <InlineEditor {...props} {...testProps} />
    </TestRoot>
  )
}

describe('mentions and topics', () => {
  it('renders as expected', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <TestRoot>
        <InlineEditor {...props} />
      </TestRoot>
    )
    waitFor(() => {
      expect(getByPlaceholderText('Placeholder Text')).toBeTruthy()
      expect(getByDisplayValue('some value')).toBeTruthy()
    })
  })

  it('onChange is called', async () => {
    const onChangeMock = jest.fn()
    const { findByDisplayValue } = renderComponent({ onChange: onChangeMock })
    const textInput = await findByDisplayValue(props.value)
    const newValue = 'new text value'
    fireEvent.changeText(textInput, newValue)
    expect(onChangeMock).toHaveBeenCalledWith(newValue)
  })

  it('onSubmit is called', async () => {
    const onSubmitMock = jest.fn()
    const { findByTestId } = renderComponent({ onSubmit: onSubmitMock })
    fireEvent.press(await findByTestId('submitButton'))
    expect(onSubmitMock).toHaveBeenCalledWith(props.value)
  })

  // it('inserts the markup for a mention', async () => {
  //   let currentValue
  //   const onChangeMock = jest.fn(value => { currentValue = value })
  //   const { findByTestId } = await renderComponent({ onChange: onChangeMock })
  //   // const instance = TestRenderer.create(<InlineEditor {...props} />).getInstance()
  //   // instance.handleSelectionChange({ nativeEvent: { selection: { start: 5, end: 5 } } })
  //   // instance.insertMention({ id: 333, name: 'sdfdfz' })
  //   fireEvent.press(await findByTestId('mentionPicker'))
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
  )).toEqual(
    '<p>hello world <span data-type="mention" class="mention" data-id="3344" data-label="tom">tom</span> [:5] #adlkjdf here&#39;s</p>\n'
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
    'hello <span data-type="mention" class="mention" data-id="333" data-label="tom">tom</span> <span data-type="mention" class="mention" data-id="233" data-label="two">two</span> world <span data-type="mention" class="mention" data-id="3332" data-label="three">three</span>'
  )
})
