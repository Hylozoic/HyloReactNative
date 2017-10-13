import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import UserSettings, { SocialAccounts, SocialControl, Footer } from './UserSettings'

describe('UserSettings', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      currentUser: {id: 1},
      updateUserSettings: () => {},
      unlinkAccount: () => {}
    }

    renderer.render(<UserSettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('matches snapshot with state set', () => {
    const props = {
      currentUser: {id: 1},
      updateUserSettings: () => {},
      unlinkAccount: () => {}
    }
    const renderer = ReactTestRenderer.create(<UserSettings {...props} />)
    const instance = renderer.getInstance()
    instance.setState({
      editingPassword: true,
      edits: {
        email: 'aa@bbb.com',
        password: 'hunkjnkjn',
        confirmPassword: 'fkldsflkjdf',
        facebookUrl: 'foo.com',
        twitterName: 'twee'
      },
      errors: {
        email: 'bad email',
        password: 'needs to be longer',
        confirmPassword: 'needs to match'
      }
    })

    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
