import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import Clipboard from '@react-native-community/clipboard'
import InvitePeople, { parseEmailList } from './InvitePeople'

// @react-native-community/clipboard
jest.mock('@react-native-community/clipboard/', () => ({
  setString: jest.fn()
}))
jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

// TODO: Following this issue to figure-out how to properly mock for commented-out tests below
//       https://github.com/callstack/react-native-pager-view/issues/220
describe('InvitePeople', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople />)
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

  it('renders InvitePeople', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<InvitePeople inviteLink='https://hylo.com/invitepathhere' groupName='Axolotle' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  // NOTE: SEE https://github.com/callstack/react-native-pager-view/issues/220
  // it('copies to clipboard', () => {
  //   const props = {
  //     inviteLink: 'invitelinkhere'
  //   }

  //   const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()

  //   instance.copyToClipboard()
  //   expect(Clipboard.setString).toHaveBeenCalledWith('invitelinkhere')
  // })

  // it('resetLink works', () => {
  //   const props = {
  //     regenerateAccessCode: jest.fn()
  //   }

  //   const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()

  //   instance.resetLink()
  //   expect(props.regenerateAccessCode).toHaveBeenCalledWith()
  // })

  // it('sends invites', async () => {
  //   const props = {
  //     createInvitations: jest.fn(() => Promise.resolve({
  //       payload: {
  //         data: {
  //           createInvitation: {
  //             invitations: [{ email: 'john@doe.com' }, { email: 'peaceout@way.deep' }]
  //           }
  //         }
  //       }
  //     }))
  //   }

  //   const instance = ReactTestRenderer.create(<InvitePeople {...props} />).getInstance()
  //   instance.setState({
  //     emails: 'john@doe.com, peaceout@way.deep, ,  ',
  //     message: 'hello world'
  //   })

  //   await instance.sendInvite()
  //   expect(props.createInvitations).toHaveBeenCalledWith(['john@doe.com', 'peaceout@way.deep'], 'hello world')
  //   expect(instance.state.emails).toEqual('')
  //   expect(instance.state.successMessage).toEqual('Sent 2 emails.')
  // })
})
