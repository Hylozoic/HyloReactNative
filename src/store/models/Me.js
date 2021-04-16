import { find, get, maxBy } from 'lodash/fp'
import PropTypes from 'prop-types'
import { attr, fk, many, Model } from 'redux-orm'
import { toRefArray } from 'util/reduxOrmMigration'

export const getLastViewedGroup = memberships => {
  const lastViewedMembership = maxBy(m => new Date(m.lastViewedAt), memberships)
  return get('group', lastViewedMembership)
}

export function firstName (user) {
  return user.name ? user.name.split(' ')[0] : null
}

export function canModerate (memberships, group) {
  const matchedMembership = find(
    m => m.group === get('id', group),
    toRefArray(memberships)
  )

  return get('hasModeratorRole', matchedMembership)
}

export const CURRENT_USER_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string
}

class Me extends Model {
  toString () {
    return `Me: ${this.name}`
  }

  firstName () {
    return firstName(this)
  }

  canModerate (group) {
    return canModerate(this.memberships, group)
  }

  lastViewedGroup () {
    return getLastViewedGroup(this.memberships.toModelArray())
  }
}

export class MySkillsToLearn extends Model {}
MySkillsToLearn.modelName = 'MySkillsToLearn'
MySkillsToLearn.fields = {
  me: fk('Me', 'mySkillsToLearn'),
  skillToLearn: fk('Skill', 'mySkillsToLearn')
}
export default Me

Me.modelName = 'Me'
Me.fields = {
  isAdmin: attr(),
  name: attr(),
  avatarUrl: attr(),
  posts: many('Post'),
  intercomHash: attr(),
  joinRequests: many('JoinRequest'),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),

  // strictly speaking, a membership belongs to a single person, so it's not a
  // many-to-many relationship. but putting this here ensures that when we have
  // a query on the current user that contains memberships, the data will be
  // properly extracted and stored for the user.
  memberships: many('Membership'),

  messageThreads: many('MessageThread'),
  notifications: many('Notification'),
  skills: many('Skill'),
  skillsToLearn: many({
    to: 'Skill',
    relatedName: 'personLearning',
    through: 'MySkillsToLearn',
    throughFields: [ 'me', 'skillToLearn' ]
  }),
  blockedUsers: many('Person')
}

