import { attr, Model } from 'redux-orm'

const Network = Model.createClass({
  toString () {
    return `Network: ${this.name}`
  }
})

export default Network

Network.modelName = 'Network'

Network.fields = {
  id: attr(),
  name: attr()
}
