import { ORM } from 'redux-orm'
import './Model.extension'
import Activity from './Activity'
import Agreement from './Agreement'
import Attachment from './Attachment'
import Collection, { CollectionPost } from './Collection'
import Comment from './Comment'
import CommonRole from './CommonRole'
import CustomView from './CustomView'
import EventInvitation from './EventInvitation'
import Group, { GroupRelationship, GroupSteward, GroupJoinQuestion, GroupPrerequisite, GroupToGroupJoinQuestion } from './Group'
import GroupRelationshipInvite, { GroupToGroupJoinRequestQuestionAnswer } from './GroupRelationshipInvite'
import GroupTopic from './GroupTopic'
import Invitation from './Invitation'
import JoinRequest, { JoinRequestQuestionAnswer, Question } from './JoinRequest'
import LinkPreview from './LinkPreview'
import Location from './Location'
import ModerationAction from './ModerationAction'
import Me, { MySkillsToLearn } from './Me'
import Membership from './Membership'
import Message from './Message'
import MessageThread from './MessageThread'
import Person, { PersonSkillsToLearn } from './Person'
import PersonConnection from './PersonConnection'
import PlatformAgreement from './PlatformAgreement'
import Post, { PostFollower, PostCommenter, ProjectMember } from './Post'
import PostMembership from './PostMembership'
import SearchResult from './SearchResult'
import Skill from './Skill'
import Topic from './Topic'
import Vote from './Vote'
import Widget from './Widget'

export const orm = new ORM({ stateSelector: state => state.orm })

orm.register(
  Activity,
  Agreement,
  Attachment,
  Collection,
  CollectionPost,
  Comment,
  CommonRole,
  CustomView,
  EventInvitation,
  Group,
  GroupJoinQuestion,
  GroupSteward,
  GroupPrerequisite,
  GroupRelationship,
  GroupRelationshipInvite,
  GroupToGroupJoinQuestion,
  GroupToGroupJoinRequestQuestionAnswer,
  GroupTopic,
  Invitation,
  JoinRequest,
  JoinRequestQuestionAnswer,
  LinkPreview,
  Location,
  Me,
  Membership,
  Message,
  MessageThread,
  ModerationAction,
  MySkillsToLearn,
  Person,
  PersonConnection,
  PersonSkillsToLearn,
  PlatformAgreement,
  Post,
  PostCommenter,
  PostFollower,
  PostMembership,
  ProjectMember,
  Question,
  SearchResult,
  Skill,
  Topic,
  Vote,
  Widget
)

export default orm