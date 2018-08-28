import * as store from './PostEditor.store'

const post = {
  type: 'post',
  title: 'title',
  details: 'details',
  communities: [1]
}

describe('createPost', () => {
  it('should match the last snapshot', () => {
    expect(store.createPost(post)).toMatchSnapshot()
  })
})

describe('updatePost', () => {
  it('should match the last snapshot', () => {
    const updatePost = {
      ...post,
      id: 1
    }
    expect(store.updatePost(updatePost)).toMatchSnapshot()
  })
})

describe('fetchDetailsAndMembers', () => {
  it('should match the last snapshot', () => {
    expect(store.fetchPostDetailsAndMembers(1)).toMatchSnapshot()
  })
})
