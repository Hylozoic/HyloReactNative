import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import PostGroups from './PostGroups'

describe('PostGroups', () => {
  it('matches last snapshot', () => {
    const props = {
      groups: [
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

    const renderer = ReactTestRenderer.create(<PostGroups {...props} />)
    expect(renderer).toMatchSnapshot()
  })

  it('matches last snapshot when expanded', () => {
    const props = {
      groups: [
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

    const renderer = ReactTestRenderer.create(<PostGroups {...props} />)
    renderer.getInstance().toggleExpanded()
    expect(renderer).toMatchSnapshot()
  })

  it('renders when in one group and shouldShowGroups is true', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      shouldShowGroups: true
    }

    const renderer = ReactTestRenderer.create(<PostGroups {...props} />)
    expect(renderer).toMatchSnapshot()
  })

  it('returns null when in one group and shouldShowGroups is false', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      shouldShowGroups: false
    }

    const renderer = ReactTestRenderer.create(<PostGroups {...props} />)
    expect(renderer).toMatchSnapshot()
  })
})
