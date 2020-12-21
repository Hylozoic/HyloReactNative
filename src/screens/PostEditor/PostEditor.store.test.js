import * as store from './PostEditor.store'

const post = {
  type: 'post',
  title: 'title',
  details: 'details',
  startTime: 'startTime',
  endTime: 'endTime',
  communities: [1]
}

describe('createPost', () => {
  it('should match the last snapshot', () => {
    expect(store.createPost(post)).toMatchSnapshot()
  })
})

describe('createProject', () => {
  it('should match the last snapshot', () => {
    const project = {
      ...post,
      memberIds: [1, 2, 3]
    }
    expect(store.createPost(project)).toMatchSnapshot()
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