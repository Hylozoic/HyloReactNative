import { attr, fk, many, Model } from 'redux-orm'
import Attachment from './Attachment'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'

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

export const ProjectMember = Model.createClass({})
ProjectMember.modelName = 'ProjectMember'
ProjectMember.fields = {
  post: fk('Post', 'projectmembers'),
  member: fk('Person', 'projectmembers')
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
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  details: attr(),
  linkPreview: fk('LinkPreview', 'posts'),
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
  members: many({
    to: 'Person',
    relatedName: 'projectsJoined',
    through: 'ProjectMember',
    throughFields: [ 'post', 'member' ]
  }),
  commentersTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr(),
  votesTotal: attr(),
  myVote: attr(),
  topics: many('Topic'),
  isPublic: attr()
}

export const POST_TYPES = {
  'discussion': {
    primaryColor: 'rgba(0, 163, 227, 1)', // $color-picton-blue
    backgroundColor: 'rgba(0, 163, 227, .2)', // $color-link-water
    map: false
  },
  'event': {
    primaryColor: 'rgba(254, 72, 80, 1)', // $color-medium-purple
    backgroundColor: 'rgba(254, 72, 80, .2)', // $color-moon-raker
    map: true
  },
  'offer': {
    primaryColor: 'rgba(0, 199, 157, 1)', // $color-caribbean-green
    backgroundColor: 'rgba(0, 199, 157, .2)', // $color-iceberg;
    map: true
  },
  'resource': {
    primaryColor: 'rgba(255, 212, 3, 1)', // $color-mango-yellow;
    backgroundColor: 'rgba(255, 212, 3, .2)',
    map: true
  },
  'project': {
    primaryColor: 'rgba(252, 128, 0, 1)', // $color-fuchsia-pink;
    backgroundColor: 'rgba(252, 128, 0, .2)', // $color-prim;
    map: false
  },
  'request': {
    primaryColor: 'rgba(102, 75, 165, 1)', // $color-persimmon;
    backgroundColor: 'rgba(102, 75, 165, .2)', // $color-peach-schnapps;
    map: true
  }
}

export const POST_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string,
  title: PropTypes.string,
  details: PropTypes.string,
  location: PropTypes.string,
  locationObject: PropTypes.object,
  name: PropTypes.string,
  upVotes: PropTypes.string,
  updatedAt: PropTypes.string,
  imageUrl: PropTypes.string,
  linkPreview: PropTypes.object,
  communities: PropTypes.array,
  isPublic: PropTypes.boolean
}
