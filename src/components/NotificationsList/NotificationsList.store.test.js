import * as store from './NotificationsList.store'

describe('NotificationsList.store', () => {
  describe('action creators', () => {
    it('matches the last snapshot from fetchNotifications', () => {
      expect(store.fetchNotifications(20, 0)).toMatchSnapshot()
    })

    it('matches the last snapshot from markActivityRead', () => {
      expect(store.markActivityRead('1')).toMatchSnapshot()
    })

    it('matches the last snapshot from markAllActivitiesRead', () => {
      expect(store.markAllActivitiesRead()).toMatchSnapshot()
    })
  })
})
