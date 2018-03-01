import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import InvitePeople, { PendingInvitesPage, SendInvitesPage, PendingInviteRow } from './InvitePeople'

describe('InvitePeople', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders SendInvitesPage', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SendInvitesPage inviteLink={'https://hylo.com/invitepathhere'} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders PendingInvitesPage', () => {
    const invites = [{
      id: 10,
      email: 'john@doe.com',
      lastSentAt: new Date()
    }]

    const reinviteAll = jest.fn()

    const renderer = new ReactShallowRenderer()
    renderer.render(<PendingInvitesPage invites={invites} expireInvitation={jest.fn()} resendInvitation={jest.fn()} reinviteAll={reinviteAll}/>)
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
