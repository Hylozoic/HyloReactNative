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
      ]
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    renderer.getInstance().toggleExpanded()
    expect(renderer).toMatchSnapshot()
  })

  it('renders when in one community and shouldShowCommunities is true', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      shouldShowCommunities: true
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    expect(renderer).toMatchSnapshot()
  })

  it('returns null when in one community and shouldShowCommunities is false', () => {
    const props = {
      communities: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      shouldShowCommunities: false
    }

    const renderer = ReactTestRenderer.create(<PostCommunities {...props} />)
    expect(renderer).toMatchSnapshot()
  })
})
