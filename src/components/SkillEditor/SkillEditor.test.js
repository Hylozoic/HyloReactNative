import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import SkillEditor, { SkillCloud, SkillPill } from './SkillEditor'

jest.mock('react-native-device-info')

describe('SkillEditor', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      saveAndNext: () => {},
      skill: 'Pop',
      setSkill: () => {},
      userSkills: ['Snap', 'Crackle'],
      remainingSkills: ['One', 'Two'],
      addSkill: () => {},
      removeSkill: () => {}
    }

    renderer.render(<SkillEditor {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('calls loadSkills on mount', () => {
    const props = {
      loadSkills: jest.fn(),
      skill: 'Pop',
      userSkills: ['Snap', 'Crackle'],
      remainingSkills: ['One', 'Two']
    }
    ReactTestRenderer.create(<SkillEditor {...props} />)
    expect(props.loadSkills).toHaveBeenCalled()
  })

  const defaultProps = {
    loadSkills: () => {},
    remainingSkills: []
  }

  describe('addSkill', () => {
    it('calls the prop and sets state', () => {
      const props = {
        ...defaultProps,
        addSkill: jest.fn()
      }
      const skill = 'jump'
      const instance = ReactTestRenderer.create(<SkillEditor {...props} />).getInstance()
      instance.setState({showOther: false})
      instance.addSkill(skill)
      expect(instance.state.showOther).toEqual(true)
      expect(props.addSkill).toHaveBeenCalledWith(skill)
    })
  })

  describe('removeSkill', () => {
    it('calls the prop and sets state', () => {
      const props = {
        ...defaultProps,
        removeSkill: jest.fn()
      }
      const skill = 'jump'
      const instance = ReactTestRenderer.create(<SkillEditor {...props} />).getInstance()
      instance.setState({showOther: false})
      instance.removeSkill(skill)
      expect(instance.state.showOther).toEqual(true)
      expect(props.removeSkill).toHaveBeenCalledWith(skill)
    })
  })

  describe('onPressOther', () => {
    it('calls the prop and sets state', () => {
      const instance = ReactTestRenderer.create(<SkillEditor {...defaultProps} />).getInstance()
      instance.setState({showOther: true})
      instance.control.focus = jest.fn()
      instance.onPressOther()
      expect(instance.state.showOther).toEqual(false)
      expect(instance.control.focus).toHaveBeenCalled()
    })
  })
})

describe('SkillCloud', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      skills: ['Snap', 'Crackle'],
      onPress: () => {},
      style: {color: 'red'}
    }

    renderer.render(<SkillCloud {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('SkillPill', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      skill: 'Snap',
      onPress: () => {}
    }

    renderer.render(<SkillPill {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
