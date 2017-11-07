import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberDetails, { MemberBio, MemberSkills, MemberCommunities, CommunityRow } from './MemberDetails'
import { pick } from 'lodash/fp'

jest.mock('react-native-device-info')
jest.mock('TextInput', () => 'TextInput')

describe('MemberDetails', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberDetails
      person={{id: 1}}
      goToCommunity={() => {}}
      skills={['One']} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it("returns Loading when there's no person", () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberDetails />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () =>
    expect(MemberDetails.navigationOptions({navigation: {state: {}}})).toMatchSnapshot())

  describe('componentDidMount', () => {
    it('sets the state when person changes', () => {
      const prevProps = {
        person: {
          id: 2
        }
      }

      const props = {
        person: {
          id: 1,
          name: 'don',
          location: 'here',
          tagline: 'rock',
          bio: 'stuff',
          omitable: 'should be omitted'
        },
        fetchPerson: () => {}
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({person: {}})
      instance.componentDidUpdate(prevProps)
      expect(instance.state.person).toEqual(pick(['name', 'location', 'tagline', 'bio'], props.person))
    })
  })

  describe('editProfile', () => {
    it('sets state.editing to true', () => {
      const props = {
        person: {},
        fetchPerson: () => {}
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.editProfile()
      expect(instance.state.editing).toEqual(true)
    })
  })

  describe('updateSetting', () => {
    it('updates state.person', () => {
      const props = {
        person: {},
        fetchPerson: () => {}
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.updateSetting('name')('joe')
      expect(instance.state.person.name).toEqual('joe')
    })
  })

  describe('saveChanges', () => {
    it('calls updateUserSettings', () => {
      const props = {
        person: {},
        fetchPerson: () => {},
        updateUserSettings: jest.fn()
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({
        person: {
          name: 'joe',
          location: 'oakland'
        }
      })
      instance.saveChanges()
      expect(props.updateUserSettings).toHaveBeenCalledWith(instance.state.person)
    })
  })
})

describe('MemberBio', () => {
  it('matches the last snapshot', () => {
    const person = {
      bio: 'I live I die!'
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberBio
      person={person}
      updateSetting={() => () => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns null when bio is empty', () => {
    const person = {
      bio: ''
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberBio
      person={person} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })

  describe('focus', () => {
    it('calls control.focus', () => {
      const instance = ReactTestRenderer.create(<MemberBio person={{}} />).getInstance()
      instance.control = {
        focus: jest.fn()
      }
      instance.focus()
      expect(instance.control.focus).toHaveBeenCalled()
    })
  })
})

describe('MemberSkills', () => {
  it('matches the last snapshot', () => {
    const skills = [
      {id: 1, name: 'run'},
      {id: 2, name: 'all'},
      {id: 3, name: 'day'}
    ]

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberSkills
      skills={skills} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns null when skills is empty', () => {
    const person = {
      skills: []
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberSkills
      person={person} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })
})

describe('MemberCommunities', () => {
  it('matches the last snapshot', () => {
    const person = {
      memberships: [
        {id: 1},
        {id: 2},
        {id: 3}
      ]
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberCommunities
      person={person} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns null when skills is empty', () => {
    const person = {
      memberships: []
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberCommunities
      person={person} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toBeNull()
  })
})

describe('CommunityRow', () => {
  it('matches the last snapshot', () => {
    const membership = {
      community: {
        id: 23,
        name: 'Great Place',
        memberCount: 432
      },
      hasModeratorRole: false
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunityRow
      membership={membership} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('handles high member count and moderator role', () => {
    const membership = {
      community: {
        id: 23,
        name: 'Greater Place',
        memberCount: 24495
      },
      hasModeratorRole: true
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunityRow
      membership={membership} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
