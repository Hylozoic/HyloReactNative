import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import SignupFlow4 from './SignupFlow4'

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Hill',
    email: 'jill@hill.com',
    password: 'fill',
    location: 'hill',
    avatarUrl: 'mill.png',
    skills: ['One', 'Two'],
    finishSignup: () => {},
    makeChanges: () => {}
  }

  renderer.render(<SignupFlow4 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('hides image when no url and password when no password', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    name: 'Hill',
    email: 'jill@hill.com',
    password: '',
    location: 'hill',
    avatarUrl: '',
    skills: ['One', 'Two'],
    finishSignup: () => {},
    makeChanges: () => {}
  }

  renderer.render(<SignupFlow4 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('updateField', () => {
  it('nulls the error and calls updateLocalSetting', () => {
    const props = {
      skills: [],
      updateLocalSetting: jest.fn()
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    instance.setState({ errors: { email: 'problem' } })
    instance.updateField('email', 'a@b.c')
    expect(instance.state.errors.email).toEqual(null)
    expect(props.updateLocalSetting).toHaveBeenCalledWith('email', 'a@b.c')
  })
})

describe('updateSetting', () => {
  it('nulls the error and calls updateLocalSetting', () => {
    const props = {
      skills: [],
      updateSetting: jest.fn()
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    instance.validate = () => false
    instance.updateSetting('email', 'a@b.c')
    expect(props.updateSetting).not.toHaveBeenCalled()
    instance.validate = () => true
    instance.updateSetting('email', 'a@b.c')
    expect(props.updateSetting).toHaveBeenCalledWith('email', 'a@b.c')
  })
})

describe('validate', () => {
  it('returns true when the props are good', () => {
    const props = {
      skills: [],
      updateSetting: jest.fn(),
      name: 'la',
      email: 'ang@bol.com',
      password: 'qweqweqwe',
      confirmPassword: 'qweqweqwe',
      showPasswordField: true
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    expect(instance.validate('name')).toEqual(true)
    expect(instance.validate('email')).toEqual(true)
    expect(instance.validate('password')).toEqual(true)
    expect(instance.validate('other')).toEqual(true)
    expect(instance.state.errors).toMatchSnapshot()
  })

  it('returns false and populates state when the props are bad', () => {
    const props = {
      skills: [],
      updateSetting: jest.fn(),
      name: '',
      email: 'a.b',
      password: 'qweqweq',
      confirmPassword: 'qw',
      showPasswordField: true
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    expect(instance.validate('name')).toEqual(false)
    expect(instance.validate('email')).toEqual(false)
    expect(instance.validate('password')).toEqual(false)
    expect(instance.state.errors).toMatchSnapshot()
  })
})

describe('setError', () => {
  it('nulls the error and calls updateLocalSetting', () => {
    const props = {
      skills: []
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    instance.setError('email', 'bad')
    expect(instance.state.errors.email).toEqual('bad')
  })
})

describe('finishSignup', () => {
  it('calls finishSignup if there are no unsaved controls', () => {
    const props = {
      skills: [],
      finishSignup: jest.fn()
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    instance.controls = {}
    instance.finishSignup()
    expect(props.finishSignup).toHaveBeenCalled()
  })

  it('calls highlightCheck on unsaved controls', () => {
    const props = {
      skills: [],
      finishSignup: jest.fn()
    }

    const controlRefs = {
      saved: {
        current: {
          isEditable: () => false,
          highlightCheck: jest.fn()
        }
      },
      unsaved: {
        current: {
          isEditable: () => true,
          highlightCheck: jest.fn()
        }
      }
    }
    const instance = ReactTestRenderer.create(<SignupFlow4 {...props} />).root.instance
    instance.controlRefs = controlRefs
    instance.finishSignup()
    expect(props.finishSignup).not.toHaveBeenCalled()
    expect(controlRefs.saved.current.highlightCheck).not.toHaveBeenCalled()
    expect(controlRefs.unsaved.current.highlightCheck).toHaveBeenCalled()
  })
})
