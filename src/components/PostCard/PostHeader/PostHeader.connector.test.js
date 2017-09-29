import { mergeProps } from './PostHeader.connector'

describe('mergeProps', () => {
  it('cannot Flag when user is creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false},
    }
    const ownProps = {creator: {id: 30}}
    const { canFlag } = mergeProps(stateProps, { }, ownProps)

    expect(canFlag).toBeTruthy()
  })

  it('can Flag when user is not creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false}
    }
    const ownProps = {creator: {id: 20}}
    const { canFlag } = mergeProps(stateProps, { }, ownProps)

    expect(canFlag).toBeFalsy()
  })
})
