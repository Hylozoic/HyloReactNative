import { attr, Model, many } from 'redux-orm'

const Network = Model.createClass({
  toString () {
    return `Network: ${this.name}`
  }
})

export default Network

Network.modelName = 'Network'

Network.fields = {
  id: attr(),
  name: attr(),
  posts: many('Post'),
  members: many('Person'),
  communities: many('Community')
}
