import orm from '../../store/models'
import * as store from './NotificationsList.store'

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

describe('presentedText', () => {
  it('removes tags', () => {
    const markup = '<p>Paragraph, with <em>emphasised</em> and <strong>strong</strong> text.'
    const expected = 'Paragraph, with emphasised and strong text.'
    const actual = store.presentedText(markup)
    expect(actual).toBe(expected)
  })

  it('removes unmatched tags', () => {
    const markup = '<p>Paragraph, without closing tag.'
    const expected = 'Paragraph, without closing tag.'
    const actual = store.presentedText(markup)
    expect(actual).toBe(expected)
  })

  it('decodes HTML entities', () => {
    const markup = '&gt;&amp;&quot;'
    const expected = '>&\"'
    const actual = store.presentedText(markup)
    expect(actual).toBe(expected)
  })

  it('trucates to NOTIFICATION_TEXT_MAX', () => {
    const markup = 'a'.repeat(store.NOTIFICATION_TEXT_MAX + 1)
    const expected = 'a'.repeat(store.NOTIFICATION_TEXT_MAX)
    const actual = store.presentedText(markup)
    expect(actual).toBe(expected)
  })
})

describe('refineActivity', () => {
  const navigation = {}
  let session = null

  beforeEach(() => {
    navigation.navigate = jest.fn()
    session = orm.mutableSession(orm.getEmptyState())
    session.Activity.create({
      actor: '1',
      action: 'commentMention',
      comment: '1',
      community: null,
      createdAt: 'Wed Oct 04 2017 00:06:56 GMT+1300 (NZDT)',
      id: '1',
      meta: { reasons: [] },
      post: '333',
      unread: false
    })
    session.Comment.create({
      id: '1',
      text: '<a href=\"#\" data-entity-type=\"mention\" data-user-id=\"86895\">Rich Churcher</a>'
    })
    session.Community.create({ id: '222', name: 'Aardvarks Alert' })
    session.Notification.create({ id: '1', activity: '1' })
    session.Person.create({
      id: '1',
      avatarUrl: 'https://wombat.com',
      name: 'Wombat McAardvark'
    })
    session.Post.create({
      id: '333',
      title: 'This post should have a really long title. It should not even come close to fitting on a notification header. It should be truncated.',
      details: 'So detailed.'
    })
  })

  it('matches the previous ACTION_COMMENT_MENTION snapshot', () => {
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    expect(actual).toMatchSnapshot()
  })

  it('navigates to PostDetails for ACTION_COMMENT_MENTION', () => {
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    actual.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('PostDetails', { id: '333' })
  })

  it('matches the previous ACTION_MENTION snapshot', () => {
    session.Activity.withId('1').update({ action: 'mention' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    expect(actual).toMatchSnapshot()
  })

  it('navigates to PostDetails for ACTION_MENTION', () => {
    session.Activity.withId('1').update({ action: 'mention' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    actual.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('PostDetails', { id: '333' })
  })

  it('matches the previous ACTION_TOPIC snapshot', () => {
    session.Activity.withId('1').update({ action: 'tag', meta: { reasons: [ 'tag: aardvark' ] } })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    expect(actual).toMatchSnapshot()
  })

  it('navigates to Feed (topic) for ACTION_TOPIC', () => {
    session.Activity.withId('1').update({ action: 'tag', meta: { reasons: [ 'tag: aardvark' ] } })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    actual.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('Feed', { topicName: 'aardvark' })
  })

  it('matches the previous ACTION_JOIN_REQUEST snapshot', () => {
    session.Activity.withId('1').update({ action: 'joinRequest', community: '222' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    expect(actual).toMatchSnapshot()
  })

  it('navigates to Settings for ACTION_JOIN_REQUEST', () => {
    session.Activity.withId('1').update({ action: 'joinRequest', community: '222' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    actual.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('Settings')
  })

  it('matches the previous ACTION_APPROVED_JOIN_REQUEST snapshot', () => {
    session.Activity.withId('1').update({ action: 'approvedJoinRequest', community: '222' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    expect(actual).toMatchSnapshot()
  })

  it('navigates to Feed (community) for ACTION_APPROVED_JOIN_REQUEST', () => {
    session.Activity.withId('1').update({ action: 'approvedJoinRequest', community: '222' })
    const notification = session.Notification.all().toModelArray()[0]
    const actual = store.refineActivity(notification.activity, navigation)
    actual.onPress()
    expect(navigation.navigate).toHaveBeenCalledWith('Feed', { communityId: '222' })
  })
})
