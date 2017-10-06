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
