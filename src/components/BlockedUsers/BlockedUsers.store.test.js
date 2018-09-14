import { updateMembershipSettings, updateAllMemberships } from './BlockedUsers.store'

describe('updateMembershipSettings', () => {
  it('matches snapshot', () => expect(updateMembershipSettings(123, {sendEmail: true})).toMatchSnapshot())
})

describe('updateAllMemberships', () => {
  it('matches snapshot', () => expect(updateAllMemberships([123, 456], {sendEmail: true})).toMatchSnapshot())
})
