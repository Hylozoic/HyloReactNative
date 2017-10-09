import { mapDispatchToProps } from './PostFooter.connector'

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const props = {
      id: 10,
      myVote: true
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.vote()
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
    expect(dispatch.mock.calls[0][0]).toHaveProperty('graphql.variables.isUpvote', false)
  })
})
