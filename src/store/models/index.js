import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Attachment from './Attachment'
import Comment from './Comment'
import Group, { GroupConnection, GroupModerator } from './Group'
import GroupTopic from './GroupTopic'
import Invitation from './Invitation'
import Location from './Location'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import PersonConnection from './PersonConnection'
import Message from './Message'
import MessageThread from './MessageThread'
import Notification from './Notification'
import Post, { PostFollower, PostCommenter, ProjectMember } from './Post'
import PostMembership from './PostMembership'
import SearchResult from './SearchResult'
import Skill from './Skill'
import Topic from './Topic'
import Vote from './Vote'

const orm = new ORM({ stateSelector: state => state.orm })

orm.register(
  Activity,
  Attachment,
  Comment,
  Group,
  GroupConnection,
  GroupModerator,
  GroupTopic,
  Invitation,
  Location,
  Me,
  Membership,
  Message,
  MessageThread,
  Notification,
  Person,
  PersonConnection,
  Post,
  PostFollower,
  PostCommenter,
  PostMembership,
  ProjectMember,
  SearchResult,
  Skill,
  Topic,
  Vote
)

export default orm
