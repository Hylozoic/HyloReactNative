import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Attachment from './Attachment'
import Comment from './Comment'
import EventInvitation from './EventInvitation'
import Group, {
  GroupRelationship, GroupModerator, GroupJoinQuestion,
  GroupPrerequisite, GroupToGroupJoinQuestion
} from './Group'
import GroupRelationshipInvite, { GroupToGroupJoinRequestQuestionAnswer } from './GroupRelationshipInvite'
import GroupTopic from './GroupTopic'
import Invitation from './Invitation'
import Location from './Location'
import Me, { MySkillsToLearn } from './Me'
import Membership from './Membership'
import Person, { PersonSkillsToLearn } from './Person'
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
import JoinRequest, { JoinRequestQuestionAnswer, Question } from './JoinRequest'

export const orm = new ORM({ stateSelector: state => state.orm })

orm.register(
  Activity,
  Attachment,
  Comment,
  EventInvitation,
  Group,
  GroupJoinQuestion,
  GroupModerator,
  GroupPrerequisite,
  GroupRelationship,
  GroupRelationshipInvite,
  GroupToGroupJoinQuestion,
  GroupToGroupJoinRequestQuestionAnswer,
  GroupTopic,
  Invitation,
  JoinRequest,
  JoinRequestQuestionAnswer,
  Location,
  Me,
  Membership,
  Message,
  MessageThread,
  MySkillsToLearn,
  Notification,
  Person,
  PersonConnection,
  PersonSkillsToLearn,
  Post,
  PostCommenter,
  PostFollower,
  PostMembership,
  ProjectMember,
  Question,
  SearchResult,
  Skill,
  Topic,
  Vote
)

export default orm
