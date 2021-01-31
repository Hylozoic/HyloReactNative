import { attr, fk, many, Model } from 'redux-orm'
import { find, get, maxBy } from 'lodash/fp'
import PropTypes from 'prop-types'

export const getLastViewedCommunity = memberships => {
  const lastViewedMembership = maxBy(m => new Date(m.lastViewedAt), memberships)
  return get('community', lastViewedMembership)
}

class Me extends Model {
  toString () {
    return `Me: ${this.name}`
  }

  firstName () {
    return this.name ? this.name.split(' ')[0] : null
  }

  canModerate (community) {
    const memberships = this.memberships.toRefArray
      ? this.memberships.toRefArray()
      : this.memberships
    const membership = find(m =>
      m.community === get('id', community), memberships)
    return get('hasModeratorRole', membership)
  }

  lastViewedCommunity () {
    return getLastViewedCommunity(this.memberships.toModelArray())
  }
}

export default Me

Me.modelName = 'Me'
Me.fields = {
  isAdmin: attr(),
  name: attr(),
  avatarUrl: attr(),
  posts: many('Post'),
  intercomHash: attr(),
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
  blockedUsers: many('Person')
}

export const CURRENT_USER_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string
}
