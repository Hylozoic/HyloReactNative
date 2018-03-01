import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import InvitePeople, { PendingInvitesPage, SendInvitesPage, PendingInviteRow, parseEmailList } from './InvitePeople'

describe('InvitePeople', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('parses emails correctly', () => {
    const emails = 'asdlfkjf <joe@shoe.com>, joe@eee.com,, tom@fool \n joeii@gmail.com'
    const parsed = parseEmailList(emails)
    expect(parsed).toHaveLength(4)
    expect(parsed[0]).toEqual('joe@shoe.com')
    expect(parsed[2]).toEqual('tom@fool')
    expect(parsed[3]).toEqual('joeii@gmail.com')

    expect(parseEmailList('')).toHaveLength(0)
    expect(parseEmailList(',')).toHaveLength(0)
    expect(parseEmailList('   ')).toHaveLength(0)
    expect(parseEmailList(' \n \n  ')).toHaveLength(0)
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
      lastSentAt: new Date(99, 5, 24, 11, 33, 30, 0)
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
      lastSentAt: new Date(99, 5, 24, 11, 33, 30, 0)
    }
    const expireInvitation = jest.fn()
    const resendInvitation = jest.fn()

    renderer.render(<PendingInviteRow invite={invite} expireInvitation={expireInvitation} resendInvitation={resendInvitation} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
