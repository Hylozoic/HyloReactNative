// import Editor from './index'
import React from 'react'
import Editor, { setHtml } from './Editor'
import { SearchType } from './Search'
import ReactShallowRenderer from 'react-test-renderer/shallow'

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Editor />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})

describe('setHtml', () => {
  it('matches snapshot when searching for a Person', () => {
    const action = SearchType.PERSON
    const choice = {
      id: 1,
      name: 'jane'
    }
    expect(setHtml(action, choice)).toMatchSnapshot()
  })

  it('matches snapshot when searching for a Topic', () => {
    const action = SearchType.TOPIC
    const choice = 'topicName'
    expect(setHtml(action, choice)).toMatchSnapshot()
  })
})
