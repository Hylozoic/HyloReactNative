import { unlinkAccount } from './NotificationSettings.store'

describe('unlinkAccount', () => {
  it('matches snapshot', () => expect(unlinkAccount('facebook')).toMatchSnapshot())
})
