import { mergeProps } from './PostHeader.connector'

describe('mergeProps', () => {
  it('cannot Flag when user is creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false},
    }
    const ownProps = {creator: {id: 20}}
    const { canFlag } = mergeProps(stateProps, { }, ownProps)

    expect(canFlag).toBeFalsy()
  })

  it('can Flag when user is not creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false}
    }
    const ownProps = {creator: {id: 40}}
    const { canFlag } = mergeProps(stateProps, { }, ownProps)

    expect(canFlag).toBeTruthy()
  })
  
  it('can edit post when user is creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false},
    }
    const ownProps = {creator: {id: 20}}
    const { canEdit, editPost } = mergeProps(stateProps, { }, ownProps)

    expect(canEdit).toBeTruthy()
    expect(editPost).toBeTruthy()
  })

  it('cannot edit post when user is not creator', () => {
    const stateProps = {
      currentUser: {id: 20, canModerate: () => false},
    }
    const ownProps = {creator: {id: 40}}
    const { canEdit, editPost } = mergeProps(stateProps, { }, ownProps)

    expect(canEdit).toBeFalsy()
    expect(editPost).toBeFalsy()
  })
})
