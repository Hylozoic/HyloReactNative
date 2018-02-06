import { attr, fk, many, Model } from 'redux-orm'
import Attachment from './Attachment'
import { get } from 'lodash/fp'

export const PostFollower = Model.createClass({})
PostFollower.modelName = 'PostFollower'
PostFollower.fields = {
  post: fk('Post', 'postfollowers'),
  follower: fk('Person', 'postfollowers')
}

export const PostCommenter = Model.createClass({})
PostCommenter.modelName = 'PostCommenter'
PostCommenter.fields = {
  post: fk('Post', 'postcommenters'),
  commenter: fk('Person', 'postcommenters')
}

const Post = Model.createClass({
  toString () {
    return `Post: ${this.name}`
  },

  images () {
    return this.attachments.filter(x => x.type === Attachment.Type.IMAGE)
  },

  getImageUrls () {
    return this.images().orderBy(get('position')).toRefArray().map(x => x.url)
  },

  files () {
    return this.attachments.filter(x => x.type === Attachment.Type.FILE)
  },

  getFileUrls () {
    return this.files().orderBy(get('position')).toRefArray().map(get('url'))
  }
})

export default Post

Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  title: attr(),
  type: attr(),
  details: attr(),
  creator: fk('Person', 'posts'),
  followers: many({
    to: 'Person',
    relatedName: 'postsFollowing',
    through: 'PostFollower',
    throughFields: [ 'post', 'follower' ]
  }),
  communities: many('Community'),
  postMemberships: many('PostMembership'),
  communitiesTotal: attr(),
  commenters: many({
    to: 'Person',
    relatedName: 'postsCommented',
    through: 'PostCommenter',
    throughFields: [ 'post', 'commenter' ]
  }),
  commentersTotal: attr(),
  commentsTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr(),
  votesTotal: attr(),
  myVote: attr()
}
