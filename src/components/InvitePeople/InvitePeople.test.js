import React from 'react'
import { Clipboard } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import InvitePeople, { PendingInvitesPage, SendInvitesPage, PendingInviteRow, parseEmailList } from './InvitePeople'
import ReactTestRenderer from 'react-test-renderer'

jest.mock('Clipboard', () => ({
  setString: jest.fn()
}))

jest.mock('../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('InvitePeople', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {}}}}
    expect(InvitePeople.navigationOptions(props)).toMatchSnapshot()
  })

  it('fetches communities on update', () => {
    const props = {
      community: { slug: 'foo' },
      fetchCommunitySettings: jest.fn()
    }
    const prevPropsSameSlug = {
      community: { slug: 'foo' },
      fetchCommunitySettings: jest.fn()
    }

    const prevPropsDifferentSlug = {
      community: { slug: 'bar' },
      fetchCommunitySettings: jest.fn()
    }

    const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()

    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsSameSlug)
    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentSlug)
    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(2)
  })

  it('handles tab-view functions', () => {
    const props = {
      community: { slug: 'foo' },
      fetchCommunitySettings: jest.fn()
    }

    const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()

    instance._handleIndexChange(1)
    expect(instance.state.index).toEqual(1)

    expect(instance._renderHeader({})).toMatchSnapshot()

    expect(instance._renderScene({route: {key: '0'}})).toMatchSnapshot()
    expect(instance._renderScene({route: {key: '1'}})).toMatchSnapshot()
    expect(instance._renderScene({route: {key: '2'}})).toEqual(null)
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
    renderer.render(<SendInvitesPage inviteLink={'https://hylo.com/invitepathhere'} communityName='Axolotle' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('copies to clipboard', () => {
    const props = {
      inviteLink: 'invitelinkhere'
    }

    const instance = ReactTestRenderer.create(<SendInvitesPage {...props} />).getInstance()

    instance.copyToClipboard()
    expect(Clipboard.setString).toHaveBeenCalledWith('invitelinkhere')
  })

  it('resetLink works', () => {
    const props = {
      regenerateAccessCode: jest.fn()
    }

    const instance = ReactTestRenderer.create(<SendInvitesPage {...props} />).getInstance()

    instance.resetLink()
    expect(props.regenerateAccessCode).toHaveBeenCalledWith()
  })

  it('sends invites', async () => {
    const props = {
      createInvitations: jest.fn(() => Promise.resolve({
        payload: {
          data: {
            createInvitation: {
              invitations: [{email: 'john@doe.com'}, {email: 'peaceout@way.deep'}]
            }
          }
        }
      }))
    }

    const instance = ReactTestRenderer.create(<SendInvitesPage {...props} />).getInstance()
    instance.setState({
      emails: 'john@doe.com, peaceout@way.deep, ,  ',
      message: 'hello world'
    })

    await instance.sendInvite()
    expect(props.createInvitations).toHaveBeenCalledWith(['john@doe.com', 'peaceout@way.deep'], 'hello world')
    expect(instance.state.emails).toEqual('')
    expect(instance.state.successMessage).toEqual('Sent 2 emails.')
  })

  it('renders PendingInvitesPage', () => {
    const invites = [{
      id: 10,
      email: 'john@doe.com',
      lastSentAt: new Date(1520056309903)
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

  it('has toggleAllowCommunityInvites and calls the function to make the request on the server', () => {
    const allowCommunityInvites = jest.fn(() => new Promise(() => {}))
    const props = {
      community: {
        id: 1,
        name: 'Hylo'
      },
      allowCommunityInvites,
      fetchCommunitySettings: jest.fn(() => new Promise(() => {}))
    }
    const instance = ReactTestRenderer.create(<SendInvitesPage {...props} />).getInstance()
    instance.toggleAllowCommunityInvites()
    expect(allowCommunityInvites).toBeCalled()
    expect(instance.state.communityMembersCanInvite).toBeTruthy()
  })
})
