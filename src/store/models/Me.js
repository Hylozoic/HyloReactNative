import { attr, many, Model } from 'redux-orm'
import { find, get, maxBy } from 'lodash/fp'

const Me = Model.createClass({
  toString () {
    return `Me: ${this.name}`
  },

  firstName () {
    return this.name ? this.name.split(' ')[0] : null
  },

  canModerate (community) {
    const memberships = this.memberships.toRefArray
      ? this.memberships.toRefArray()
      : this.memberships
    const membership = find(m =>
      m.community === get('id', community), memberships)
    return get('hasModeratorRole', membership)
  },

  lastViewedMembership () {
    return maxBy(m => new Date(m.lastViewedAt), this.memberships.toModelArray())
  },

  lastViewedCommunity () {
    return get('community', this.lastViewedMembership())
  }
})

export default Me

Me.modelName = 'Me'
Me.fields = {
  name: attr(),
  avatarUrl: attr(),
  posts: many('Post'),
  memberships: many('Membership'),
  messageThreads: many('MessageThread'),
  notifications: many('Notification'),
  skills: many('Skill')
}
