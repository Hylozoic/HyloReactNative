import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import PendingInvitesPage from './PendingInvitesPage'

// TODO: Following this issue to figure-out how to properly mock for commented-out tests below
//       https://github.com/callstack/react-native-pager-view/issues/220
describe('InvitePeople', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PendingInvitesPage />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  // it('fetches groups on update', () => {
  //   const props = {
  //     group: { slug: 'foo', settings: { setAllowGroupInvites: false } },
  //     fetchGroupSettings: jest.fn()
  //   }
  //   const prevPropsSameSlug = {
  //     group: { slug: 'foo', settings: { setAllowGroupInvites: false } },
  //     fetchGroupSettings: jest.fn()
  //   }

  //   const prevPropsDifferentSlug = {
  //     group: { slug: 'bar', settings: { setAllowGroupInvites: false } },
  //     fetchGroupSettings: jest.fn()
  //   }

  //   const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()

  //   expect(props.fetchGroupSettings).toHaveBeenCalledTimes(1)
  //   instance.componentDidUpdate(prevPropsSameSlug)
  //   expect(props.fetchGroupSettings).toHaveBeenCalledTimes(1)
  //   instance.componentDidUpdate(prevPropsDifferentSlug)
  //   expect(props.fetchGroupSettings).toHaveBeenCalledTimes(2)
  // })

  it('renders', () => {
    const invites = [{
      id: 10,
      email: 'john@doe.com',
      lastSentAt: new Date(1520056309903)
    }]

    const reinviteAll = jest.fn()

    const renderer = new ReactShallowRenderer()
    renderer.render(<PendingInvitesPage invites={invites} expireInvitation={jest.fn()} resendInvitation={jest.fn()} reinviteAll={reinviteAll} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders PendingInviteRow', () => {
    const renderer = new ReactShallowRenderer()
    const invite = {
      id: 10,
      email: 'john@doe.com',
      lastSentAt: new Date()
    }
    const expireInvitation = jest.fn()
    const resendInvitation = jest.fn()

    renderer.render(<PendingInviteRow invite={invite} expireInvitation={expireInvitation} resendInvitation={resendInvitation} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
