import { Alert } from 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import UserSettings, { SocialAccounts, SocialControl, Footer } from './UserSettings'
import { omit } from 'lodash/fp'

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

  it('sets edit state on mount', () => {
    const props = {
      currentUser: {
        email: 'ra@ra.com',
        facebookUrl: 'foo.com',
        twitterName: 'rara'
      }
    }

    const instance = ReactTestRenderer.create(<UserSettings {...props} />).getInstance()
    expect(instance.state.edits).toEqual(props.currentUser)
  })

  describe('componentDidUpdate', () => {
    it('calls setEditState when currentUser changes', () => {
      const prevProps = {
        currentUser: null
      }
      const props = {
        currentUser: {id: 1}
      }
      const instance = ReactTestRenderer.create(<UserSettings {...props} />).getInstance()
      instance.setEditState = jest.fn()
      instance.componentDidUpdate(prevProps)
      expect(instance.setEditState).toHaveBeenCalled()
    })
  })

  describe('setEditState', () => {
    // the bulk of this function is tested above in the 'on mount' test
    it("Doesn't change the state when currentUser is null", () => {
      const props = {
        currentUser: null
      }
      const instance = ReactTestRenderer.create(<UserSettings {...props} />).getInstance()
      const state = {
        edits: {
          email: 'lala'
        }
      }
      instance.setState(state)
      instance.setEditState()
      expect(instance.state).toEqual({
        ...state,
        changed: false,
        editingPassword: false,
        errors: {}
      })
    })
  })

  describe('editPassword', () => {
    it('sets the satte', () => {
      const instance = ReactTestRenderer.create(<UserSettings />).getInstance()
      instance.editPassword()
      expect(instance.state.editingPassword).toEqual(true)
    })
  })

  describe('cancelPassword', () => {
    it('sets the state', () => {
      const instance = ReactTestRenderer.create(<UserSettings />).getInstance()
      instance.setState({
        editingPassword: true,
        edits: {
          email: 'moo',
          password: 'ldlkd',
          confirmPassword: 'djsdlks'
        },
        errors: {
          email: 'bad email',
          password: 'too short',
          confirmPassword: 'too different'
        }
      })
      instance.cancelPassword()
      expect(instance.state).toMatchSnapshot()
    })
  })

  describe('updateField', () => {
    it('sets the state', () => {
      const instance = ReactTestRenderer.create(<UserSettings />).getInstance()
      instance.setState({
        changed: false,
        edits: {
          email: 'moo',
          password: 'ldlkd'
        },
        errors: {
          email: 'bad email',
          password: 'too short'
        }
      })
      instance.updateField('email', 'newemail')
      expect(instance.state).toMatchSnapshot()
    })
  })

  describe('validate', () => {
    it('validates its fields', () => {
      const instance = ReactTestRenderer.create(<UserSettings />).root.instance
      instance.setState({
        edits: {
          email: 'ra',
          password: 'rarara',
          confirmPassword: 'lalala'
        }
      })
      expect(instance.validate()).toBeFalsy()
      expect(instance.state).toMatchSnapshot()
    })
  })

  describe('saveChanges', () => {
    it('sets the state and calls updateUserSettings', () => {
      const updateUserSettings = jest.fn()
      const instance = ReactTestRenderer.create(
        <UserSettings updateUserSettings={updateUserSettings} />).getInstance()
      const edits = {
        email: 'rara@rara.com',
        password: 'abcabcabc',
        confirmPassword: 'abcabcabc'
      }
      instance.setState({
        changed: true,
        editingPassword: true,
        edits
      })
      instance.saveChanges()
      expect(updateUserSettings).toHaveBeenCalledWith(omit('confirmPassword', edits))
      expect(instance.state.changed).toEqual(false)
      expect(instance.state.editingPassword).toEqual(false)
    })
  })

  describe('confirmLeave', () => {
    it('calls onLeave when changed is false', () => {
      const instance = ReactTestRenderer.create(<UserSettings />).getInstance()
      instance.setState({
        changed: false
      })
      const onLeave = jest.fn()
      instance.confirmLeave(onLeave)
      expect(onLeave).toHaveBeenCalled()
    })

    it('calls Alert.alert when changed is true', () => {
      const origAlert = Alert.alert
      Alert.alert = jest.fn()
      const instance = ReactTestRenderer.create(<UserSettings />).getInstance()
      instance.setState({
        changed: true
      })
      const onLeave = jest.fn()
      instance.confirmLeave(onLeave)
      expect(Alert.alert).toHaveBeenCalled()
      expect(Alert.alert.mock.calls).toMatchSnapshot()
      Alert.alert = origAlert
    })
  })

  describe('cancel', () => {
    it('calls confirmLeave, passing in cancel', () => {
      const cancel = () => {}
      const confirmLeave = jest.fn(fn => fn())
      const instance = ReactTestRenderer.create(<UserSettings cancel={cancel} />).root.instance
      instance.confirmLeave = confirmLeave
      instance.cancel()
      expect(confirmLeave).toHaveBeenCalledWith(cancel)
    })
  })

  describe('logout', () => {
    it('calls confirmLeave, passing in logout', () => {
      const logout = () => {}
      const confirmLeave = jest.fn(fn => fn())
      const instance = ReactTestRenderer.create(<UserSettings logout={logout} />).root.instance
      instance.confirmLeave = confirmLeave
      instance.logout()
      expect(confirmLeave).toHaveBeenCalledWith(logout)
    })
  })
})
