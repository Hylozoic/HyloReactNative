import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import PostBody from './PostBody'

it('matches the last snapshot', () => {
  const post = {
    title: 'Combined breaks and links',
    details: '<p>This post has a <a data-entity-type="mention" data-user-id="86895">Flargle</a> mention.</p><p>Then a break.</p><p>Then a para ending with a mention <a data-entity-type="mention" data-user-id="86197">Anita Cartwright</a> </p><p><a data-entity-type="mention" data-user-id="86742">Alexane Rowe</a> </p><p>More characters to trigger truncate.',
    linkPreview: null,
    slug: 'notifications-testing',
    showMember: () => {},
    showTopic: () => {},
    shouldTruncate: true
  }
  const actual = renderer.create(<PostBody {...post} />)
  expect(actual).toMatchSnapshot()
})
