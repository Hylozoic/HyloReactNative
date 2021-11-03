import React from 'react'
import { Provider } from 'react-redux'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import getEmptyState from 'store/getEmptyState'
import InvitePeople from 'screens/InvitePeople'

describe('InvitePeople Specification', () => {
  afterEach(cleanup)

  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <InvitePeople />
      </Provider>
    )

    expect(await toJSON()).toMatchSnapshot()
  })
})

// TODO: Bring back "email parsing" and "clipboard" tests
// import ReactShallowRenderer from 'react-test-renderer/shallow'
// import ReactTestRenderer from 'react-test-renderer'
// import Clipboard from '@react-native-community/clipboard'
// import InvitePeople, { parseEmailList } from './InvitePeople'
//
// // TODO: Following this issue to figure-out how to properly mock for commented-out tests below
// //       https://github.com/callstack/react-native-pager-view/issues/220
//
// jest.mock('@react-native-community/clipboard/', () => ({
//   setString: jest.fn()
// }))
// jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')
//
// describe('InvitePeople', () => {
//   it('matches the last snapshot', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<InvitePeople />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })

//   it('parses emails correctly', () => {
//     const emails = 'asdlfkjf <joe@shoe.com>, joe@eee.com,, tom@fool \n joeii@gmail.com'
//     const parsed = parseEmailList(emails)
//     expect(parsed).toHaveLength(4)
//     expect(parsed[0]).toEqual('joe@shoe.com')
//     expect(parsed[2]).toEqual('tom@fool')
//     expect(parsed[3]).toEqual('joeii@gmail.com')

//     expect(parseEmailList('')).toHaveLength(0)
//     expect(parseEmailList(',')).toHaveLength(0)
//     expect(parseEmailList('   ')).toHaveLength(0)
//     expect(parseEmailList(' \n \n  ')).toHaveLength(0)
//   })

//   it('renders InvitePeople', () => {
//     const renderer = new ReactShallowRenderer()
//     renderer.render(<InvitePeople inviteLink='https://hylo.com/invitepathhere' groupName='Axolotle' />)
//     const actual = renderer.getRenderOutput()

//     expect(actual).toMatchSnapshot()
//   })
// })