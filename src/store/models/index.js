/**
 * @providesModule store/models
 */

import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Attachment from './Attachment'
import Comment from './Comment'
import Community, { CommunityModerator } from './Community'
import CommunityTopic from './CommunityTopic'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import PersonConnection from './PersonConnection'
import Message from './Message'
import MessageThread from './MessageThread'
import Network from './Network'
import Notification from './Notification'
import Post, { PostFollower, PostCommenter } from './Post'
import PostMembership from './PostMembership'
import Skill from './Skill'
import Topic from './Topic'
import Vote from './Vote'

export const orm = new ORM()
orm.register(
  Activity,
  Attachment,
  Comment,
  Community,
  CommunityModerator,
  CommunityTopic,
  Me,
  Membership,
  Message,
  MessageThread,
  Network,
  Notification,
  Person,
  PersonConnection,
  Post,
  PostFollower,
  PostCommenter,
  PostMembership,
  Skill,
  Topic,
  Vote
)

export default orm
