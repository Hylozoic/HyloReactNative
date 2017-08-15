import React from 'react'
import { Text } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MemberFeed, { ContentRow, FeedTab } from './MemberFeed'

describe('MemberProfile', () => {
  it('matches the last snapshot', () => {
    const items = [
      {id: 1}, {id: 2}, {id: 3}
    ]
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberFeed
      items={items}
      itemType='Comment'
      choice={'Comments'}
      setChoice={() => {}}
      header={<Text>header</Text>}
      fetchMoreItems={() => {}}
      pending
      />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ContentRow', () => {
  const item = {id: 2}

  it('shows a PostCard when itemType is post', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ContentRow
      item={item}
      itemType='post' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('shows a Comment when itemType is comment', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ContentRow
      item={item}
      itemType='comment' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('FeedTab', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedTab
      option='Posts'
      chosen='Comments'
      onPress={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
