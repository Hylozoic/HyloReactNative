import { attr, fk, Model } from 'redux-orm'

class EventInvitation extends Model {
  toString () {
    return `EventInvitation: ${this.id}`
  }
}

EventInvitation.modelName = 'EventInvitation'
EventInvitation.fields = {
  id: attr(),
  response: attr(),
  event: fk('Post', 'eventInvitations'),
  person: fk('Person', 'eventInvitations')
}

export default EventInvitation

export const RESPONSES = {
  YES: 'yes',
  NO: 'no',
  INTERESTED: 'interested'
}

export const humanResponse = (response, t) => {
  return {
    yes: t('Going'),
    no: t('Not Going'),
    interested: t('Interested')
  }[response]
}
