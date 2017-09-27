import { remainingSkills } from './SignupFlow4.connector'

describe('remainingSkills', () => {
  const defaultSkills = [
    'singing', 'slinging', 'dancing', 'dashing', 'daring'
  ]

  it('filters chosen skills', () => {
    const userSkills = ['singing', 'dancing']
    expect(remainingSkills('', userSkills, defaultSkills))
    .toEqual(['slinging', 'dashing', 'daring'])
  })

  it('filters chosen skills and prefix', () => {
    const skillFilter = ['da']
    const userSkills = ['singing', 'dancing']
    expect(remainingSkills(skillFilter, userSkills, defaultSkills))
    .toEqual(['dashing', 'daring'])
  })
})
