import reducer, { setCommentEdits } from './CommentEditor.store'

it('matches the last snapshot for setCommentEdits', () => {
  expect(setCommentEdits('1', 'So much comment.')).toMatchSnapshot()
})

describe('reducer', () => {
  it('matches the last snapshot for SET_COMMENT_EDITS', () => {
    const action = setCommentEdits('1', 'Foo')
    const newState = reducer({}, action)
    expect(newState).toMatchSnapshot()
  })
})
