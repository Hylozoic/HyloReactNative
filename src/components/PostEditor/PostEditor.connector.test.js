import { mapStateToProps, mapDispatchToProps } from './PostEditor.connector'

const communityId = 1
const id = 1
const details = 'details'
const props = {
  navigation: {
    goBack: jest.fn(),
    state: {
      params: {
        communityId,
        id
      }
    }
  }
}
const state = {
  PostEditor: {
    details
  }
}

describe('PostEditor mapStateToProps', () => {
  it('returns communityId', () => {
    expect(mapStateToProps(state, props).communityId).toBe(communityId)
  })

  it('returns details', () => {
    expect(mapStateToProps(state, props).details).toBe(details)
  })

  it('returns a post', () => {
    expect(mapStateToProps(state, props).post).toBeDefined()
  })
})

describe('PostEditor mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.setDetails('details')
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
