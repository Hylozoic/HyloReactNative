import { attr, fk, Model } from 'redux-orm'
import { basename } from 'util/index'

const Attachment = Model.createClass({
  toString () {
    return `Attachment (${this.type}): ${this.url}`
  }
})

export default Attachment

Attachment.modelName = 'Attachment'

Attachment.fields = {
  id: attr(),
  type: attr(),
  position: attr(),
  url: attr(),
  thumbnailUrl: attr(),
  post: fk('Post', 'attachments'),
  comment: fk('Comment', 'attachments'),
  createdAt: attr()
}

Attachment.Type = {
  IMAGE: 'image',
  FILE: 'file'
}

export function cleanName (url) {
  return decodeURIComponent(basename(url))
}
