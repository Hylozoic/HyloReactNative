import { unlinkAccount } from './UserSettings.store'

describe('unlinkAccount', () => {
  it('matches snapshot', () => expect(unlinkAccount('facebook')).toMatchSnapshot())
})
