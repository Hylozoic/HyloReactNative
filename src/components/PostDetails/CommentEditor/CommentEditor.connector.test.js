import { mapStateToProps } from './CommentEditor.connector'
import { CREATE_COMMENT, MODULE_NAME } from './CommentEditor.store'

describe('mapStateToProps', () => {
  const minState = {
    [MODULE_NAME]: {}
  }
  it('correctly sets pending', () => {
    const notPendingState = {
      ...minState,
      pending: {}
    }
    const pendingState = {
      ...minState,
      pending: {
        [CREATE_COMMENT]: true
      }
    }
    expect(mapStateToProps(notPendingState).pending).toEqual(false)
    expect(mapStateToProps(pendingState).pending).toEqual(true)
  })
})
