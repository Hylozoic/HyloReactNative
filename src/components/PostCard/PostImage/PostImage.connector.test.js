import { mapStateToProps } from './PostImage.connector'
import orm from 'store/models'

it('extracts image urls from the post ordered by position', () => {
  const session = orm.session(orm.getEmptyState())
  session.Post.create({id: '1'})
  session.Attachment.create({id: '2', post: '1', type: 'image', position: 1, url: 'foo.png'})
  session.Attachment.create({id: '3', post: '1', type: 'file', position: 1, url: 'foo.pdf'})
  session.Attachment.create({id: '4', post: '1', type: 'image', position: 0, url: 'bar.png'})

  expect(mapStateToProps({orm: session.state}, {postId: 1}))
  .toEqual({imageUrls: ['bar.png', 'foo.png']})
})
