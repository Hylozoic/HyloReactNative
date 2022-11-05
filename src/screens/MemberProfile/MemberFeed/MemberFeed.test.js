import React from 'react'
import { Text } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { TestRoot } from 'util/testing'
import MemberFeed, { ContentRow, FeedTab } from './MemberFeed'

describe('MemberProfile', () => {
  it('matches the last snapshot', () => {
    const items = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <TestRoot>
        <MemberFeed
          items={items}
          itemType='Comment'
          choice='Comments'
          setChoice={() => {}}
          header={<Text>header</Text>}
          fetchMoreItems={() => {}}
          pending
        />
      </TestRoot>
    )
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ContentRow', () => {
  it('shows a PostCard when itemType is post', () => {
    const postItem = { id: 2 }
    const renderer = new ReactShallowRenderer()
    renderer.render(<ContentRow
      item={postItem}
      itemType='post'
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('shows a Comment when itemType is comment', () => {
    const commentItem = { post: { id: 2 } }
    const renderer = new ReactShallowRenderer()
    renderer.render(<ContentRow
      item={commentItem}
      itemType='comment'
                    />)
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
      onPress={() => {}}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
