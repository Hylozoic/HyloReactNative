import { Image } from 'react-native'
import { attr, many, Model, fk } from 'redux-orm'
import allGroupsBannerImage from 'assets/all-groups-banner.png'
import allGroupsAvatarUrl from 'assets/All_Groups2.png'
import allGroupshHeaderAvatarUrl from 'assets/All_Groups.png'

export const GROUP_ACCESSIBILITY = {
  Closed: 0,
  Restricted: 1,
  Open: 2
}

export const GROUP_VISIBILITY = {
  Hidden: 0,
  Protected: 1,
  Public: 2
}

export class GroupModerator extends Model { }
GroupModerator.modelName = 'GroupModerator'
GroupModerator.fields = {
  group: fk('Group', 'groupmoderators'),
  moderator: fk('Person', 'groupmoderators')
}

export class GroupTopic extends Model {}
GroupTopic.modelName = 'GroupTopic'
GroupTopic.fields = {
  group: fk('Group', 'grouptopics'),
  topic: fk('Topic', 'grouptopics')
}

export class GroupConnection extends Model {}
GroupConnection.modelName = 'GroupConnection'
GroupConnection.fields = {
  parentGroup: fk({ to: 'Group', as: 'parent', relatedName: 'childConnections' }),
  childGroup: fk({ to: 'Group', as: 'child', relatedName: 'parentConnections' })
}

class Group extends Model {
  toString () {
    return `Group: ${this.name}`
  }
}

export default Group

Group.modelName = 'Group'

Group.fields = {
  accessibility: attr(),
  childGroups: many({
    to: 'Group',
    relatedName: 'parentGroups',
    through: 'GroupConnection',
    throughFields: [ 'parentGroup', 'childGroup' ]
  }),
  feedOrder: attr(),
  id: attr(),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  members: many('Person'),
  memberCount: attr(),
  moderators: many({
    to: 'Person',
    relatedName: 'moderatedGroups',
    through: 'GroupModerator',
    throughFields: [ 'group', 'moderator' ]
  }),
  name: attr(),
  posts: many('Post'),
  postCount: attr(),
  settings: attr(),
  slug: attr(),
  visibility: attr()
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const ALL_GROUPS_ID = 'all-groups'
export const ALL_GROUPS_AVATAR_PATH = '/assets/white-merkaba.png'

export const PUBLIC_CONTEXT_ID = 'public-context'
export const PUBLIC_CONTEXT_AVATAR_PATH = '/public.svg'

export const accessibilityString = (accessibility) => {
  return Object.keys(GROUP_ACCESSIBILITY).find(key => GROUP_ACCESSIBILITY[key] === accessibility)
}

export const visibilityString = (visibility) => {
  return Object.keys(GROUP_VISIBILITY).find(key => GROUP_VISIBILITY[key] === visibility)
}

export const ALL_GROUPS_GROUP = {
  id: ALL_GROUPS_ID,
  slug: ALL_GROUPS_ID,
  headerAvatarUrl: Image.resolveAssetSource(allGroupshHeaderAvatarUrl).uri,
  avatarUrl: Image.resolveAssetSource(allGroupsAvatarUrl).uri,
  bannerUrl: Image.resolveAssetSource(allGroupsBannerImage).uri,
  name: 'All Groups',
  groups: []
}
