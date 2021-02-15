import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import DrawerMenu, { SectionHeader, NetworkRow, GroupRow, TextButton } from './DrawerMenu'
import { ALL_GROUP } from 'store/models/Group'

describe('DrawerMenu', () => {
  const minProps = {
    name: 'Roy Rogers',
    avatarUrl: 'http://anyurl',
    memberships: [],
    goToGroup: () => {},
    goToMyProfile: () => {},
    showSettings: () => {},
    currentGroupId: 12,
    canModerateCurrentGroup: true,
    networks: [],
    goToGroupSettingsMenu: jest.fn(),
    currentGroup: { name: 'foo', avatarUrl: 'someurl' },
    groups: []
  }

  it('matches the last snapshot', () => {
    const props = {
      networks: [{
        id: 1,
        name: 'Network'
      }],
      groups: [{
        id: 2,
        name: 'Group'
      }]
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<DrawerMenu {...minProps} {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('SectionHeader', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SectionHeader section={{ label: 'Networked Groups' }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

// describe('NetworkRow', () => {
//   it('matches the last snapshot', () => {
//     const renderer = new ReactShallowRenderer()
//     const network = {
//       id: 1,
//       avatarUrl: 'network.png',
//       name: 'Network Name',
//       groups: [{
//         id: 1,
//         avatarUrl: 'foo.png',
//         name: 'Foom',
//         newPostCount: 1
//       }]
//     }
//     renderer.render(<NetworkRow
//       network={network}
//       goToGroup={() => {}}
//       currentGroupId={1}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('renders correctly with nonMemberGroups', () => {
//     const renderer = new ReactShallowRenderer()
//     const network = {
//       id: 1,
//       avatarUrl: 'network.png',
//       name: 'Network Name',
//       groups: [{
//         id: 1,
//         avatarUrl: 'foo.png',
//         name: 'Foom',
//         newPostCount: 1
//       }],
//       nonMemberGroups: [{
//         id: 2,
//         avatarUrl: 'twofoo.png',
//         name: 'Twoom',
//         newPostCount: 1
//       }]
//     }
//     renderer.render(<NetworkRow
//       network={network}
//       goToGroup={() => {}}
//       currentGroupId={1}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('hides image when no avatarUrl', () => {
//     const renderer = new ReactShallowRenderer()
//     const network = {
//       id: 1,
//       name: 'Network Name',
//       groups: [{
//         id: 1,
//         avatarUrl: 'foo.png',
//         name: 'Foom',
//         newPostCount: 1
//       }]
//     }
//     renderer.render(<NetworkRow
//       network={network}
//       goToGroup={() => {}}
//       currentGroupId={1}
//                     />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('shows all groups link', () => {
//     const renderer = new ReactShallowRenderer()
//     const network = ALL_GROUP
//     renderer.render(
//       <NetworkRow
//         network={network}
//         goToGroup={() => {}}
//       />
//     )
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('sets expanded to false when no new posts in groups', () => {
//     const props = {
//       network: {
//         name: '',
//         avatarUrl: '',
//         groups: [
//           { id: 1, newPostCount: 0 },
//           { id: 2, newPostCount: 0 }
//         ]
//       }
//     }
//     const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
//     expect(instance.state.expanded).toEqual(false)
//   })

//   it('sets expanded to true when there are new posts in groups', () => {
//     const props = {
//       network: {
//         name: '',
//         avatarUrl: '',
//         groups: [
//           { id: 1, newPostCount: 1 },
//           { id: 2, newPostCount: 0 }
//         ]
//       }
//     }
//     const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
//     expect(instance.state.expanded).toEqual(true)
//   })

//   describe('toggleExpanded', () => {
//     const props = {
//       network: {
//         name: '',
//         avatarUrl: '',
//         groups: []
//       }
//     }
//     it('toggles expanded state', () => {
//       const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
//       instance.toggleExpanded()
//       expect(instance.state.expanded).toEqual(true)
//       instance.toggleExpanded()
//       expect(instance.state.expanded).toEqual(false)
//     })
//   })
// })

describe('GroupRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const group = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom',
      newPostCount: 7
    }
    renderer.render(<GroupRow
      group={group}
      goToGroup={() => {}}
      currentGroupId={2}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('hides badge when no newPostCount', () => {
    const renderer = new ReactShallowRenderer()
    const group = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom'
    }
    renderer.render(<GroupRow
      group={group}
      goToGroup={() => {}}
      currentGroupId={2}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('highlights when matching currentGroupId', () => {
    const renderer = new ReactShallowRenderer()
    const group = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom'
    }
    renderer.render(<GroupRow
      group={group}
      goToGroup={() => {}}
      currentGroupId={group.id}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

it('TextButton renders', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<TextButton text='anything' onPress={() => {}} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
