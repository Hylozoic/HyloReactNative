import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberDetails, { MemberBio, MemberSkills, MemberCommunities, CommunityRow } from './MemberDetails'
import { pick } from 'lodash/fp'

jest.mock('react-native-device-info')
jest.mock('TextInput', () => 'TextInput')
jest.mock('lodash/fp/debounce', () => ({
  debounce: (timeout, fn) => fn
}))

describe('MemberDetails', () => {
  const navigation = {setParams: () => {}}
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberDetails
      isFocused
      person={{id: 1}}
      goToCommunity={() => {}}
      skills={['One']}
      navigation={navigation} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it("returns Loading when there's no person", () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberDetails isFocused navigation={navigation} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () =>
    expect(MemberDetails.navigationOptions({
      navigation: {
        state: {params: {}},
        getParam: jest.fn()
      }
    })).toMatchSnapshot())

  describe('componentDidMount', () => {
    it('sets the state when person changes', () => {
      const prevProps = {
        person: {
          id: 2
        }
      }

      const props = {
        isFocused: true,
        person: {
          id: 1,
          name: 'don',
          location: 'here',
          tagline: 'rock',
          bio: 'stuff',
          omitable: 'should be omitted'
        },
        fetchPerson: () => {},
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({person: {}})
      instance.componentDidUpdate(prevProps, {})
      expect(instance.state.person).toEqual(pick(['name', 'location', 'tagline', 'bio'], props.person))
    })
  })

  describe('validate', () => {
    it('returns true when name is present', () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({
        person: {name: 'Sue'}
      })
      expect(instance.state.errors.name).toEqual(undefined)
    })

    it('returns false and sets error when name is empty', () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({
        person: {name: ''}
      })
      instance.validate()
      expect(instance.state.errors.name).toEqual('Name must not consist solely of whitespace.')
    })
  })

  describe('editProfile', () => {
    it('sets state.editing to true', () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.editProfile()
      expect(instance.state.editing).toEqual(true)
    })
  })

  describe('updateSetting', () => {
    it('updates state.person', () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.updateSetting('name')('joe')
      expect(instance.state.person.name).toEqual('joe')
    })
  })

  describe('saveChanges', () => {
    it('calls updateUserSettings', () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        updateUserSettings: jest.fn(),
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({
        person: {
          name: 'joe',
          location: 'oakland'
        },
        editing: true
      })
      instance.saveChanges()
      expect(instance.state.editing).toEqual(false)
      expect(props.updateUserSettings).toHaveBeenCalledWith(instance.state.person)
    })

    it("returns false and doesn't call updateUserSettings when validate is false", () => {
      const props = {
        isFocused: true,
        person: {},
        fetchPerson: () => {},
        updateUserSettings: jest.fn(),
        navigation
      }

      const instance = ReactTestRenderer.create(<MemberDetails {...props} />).getInstance()
      instance.setState({
        errors: {
          person: {}
        },
        editing: true
      })
      instance.saveChanges()
      expect(instance.state.editing).toEqual(true)
      expect(props.updateUserSettings).not.toHaveBeenCalled()
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
      updateSetting={() => () => {}}
      isMe />)
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
