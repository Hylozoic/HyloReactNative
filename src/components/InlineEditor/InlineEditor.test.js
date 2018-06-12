import React from 'react'
import InlineEditor, { mentionsToHtml, createMentionTag, createTopicTag, getMarkup, toHtml } from './InlineEditor'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { SearchType } from '../Search'

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<InlineEditor onChange={() => jest.fn()}
    onSubmit={() => jest.fn()}
    value={'some text'}
    placeholder={`Place Holder`}
    communityId={10} />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
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
