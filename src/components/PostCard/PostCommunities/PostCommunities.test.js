import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import PostCommunities from './PostCommunities'

describe('PostCommunities', () => {
  it('matches last snapshot', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        },
        {
          id: 3,
          name: 'Three',
          slug: 'three'
        }
      ],
      slug: 'hylo'
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    expect(renderer).toMatchSnapshot()
  })

  it('matches last snapshot when expanded', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one',
          avatarUrl: 'foo.png'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        },
        {
          id: 3,
          name: 'Three',
          slug: 'three'
        }
      ],
      slug: 'hylo'
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    renderer.getInstance().toggleExpanded()
    expect(renderer).toMatchSnapshot()
  })

  it('returns null when in the only community', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      slug: 'one'
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    expect(renderer).toMatchSnapshot()
  })
})
