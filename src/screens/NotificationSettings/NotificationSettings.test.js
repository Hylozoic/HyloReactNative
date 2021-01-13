import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import NotificationSettings, { MessageSettingsRow, AllCommunitiesSettingsRow, MembershipSettingsRow, SettingsRow, SettingsIcon } from './NotificationSettings'

describe('NotificationSettings', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      messageSettings: {
        sendEmail: true,
        sendPushNotifications: false
      },
      allCommunitiesSettings: {
        sendEmail: false,
        sendPushNotifications: true
      },
      memberships: [
        {
          id: '11',
          community: {
            id: '12',
            avatarUrl: 'foo1.png'
          },
          settings: {
            sendEmail: true,
            sendPushNotifications: false
          }
        },
        {
          id: '21',
          community: {
            id: '22',
            avatarUrl: 'foo2.png'
          },
          settings: {
            sendEmail: false,
            sendPushNotifications: true
          }
        }
      ],
      currentUser: { id: '1' },
      unlinkAccount: () => {}
    }

    renderer.render(<NotificationSettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  describe('updateMessageSettings', () => {
    it('calls updateUserSettings', () => {
      const props = {
        messageSettings: {
          sendEmail: true
        },
        updateUserSettings: jest.fn(),
        memberships: []
      }
      const instance = ReactTestRenderer.create(<NotificationSettings {...props} />).getInstance()
      instance.updateMessageSettings({ sendPushNotifications: true })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'both' } })
      instance.updateMessageSettings({ sendEmail: false })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'none' } })
      instance.updateMessageSettings({})
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'email' } })
      instance.updateMessageSettings({ sendEmail: false, sendPushNotifications: true })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'push' } })
    })
  })

  describe('updateAllCommunities', () => {
    it('calls updateAllMemberships', () => {
      const props = {
        messageSettings: {
          sendEmail: true
        },
        updateAllMemberships: jest.fn(),
        memberships: [{
          id: '11',
          community: {
            id: '1'
          }
        }, {
          id: '12',
          community: {
            id: '2'
          }
        }]
      }
      const instance = ReactTestRenderer.create(
        <NotificationSettings {...props} />
      ).getInstance()
      instance.updateAllCommunities({ sendPushNotifications: true })
      expect(props.updateAllMemberships).toHaveBeenCalledWith(['1', '2'], { sendPushNotifications: true })
    })
  })
})

describe('MessageSettingsRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      settings: { sendEmail: true },
      updateMessageSettings: () => {}
    }

    renderer.render(<MessageSettingsRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('AllCommunitiesSettingsRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      settings: { sendEmail: true },
      updateAllCommunities: () => {}
    }

    renderer.render(<AllCommunitiesSettingsRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('MembershipSettingsRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      membership: {
        settings: {
          sendEmail: true
        },
        community: {
          name: 'Foomunity',
          avatarUrl: 'foo.png'
        }
      },
      updateMembershipSettings: () => {}
    }

    renderer.render(<MembershipSettingsRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('SettingsRow', () => {
  const props = {
    imageUrl: 'foo.png',
    name: 'Foo Row',
    settings: {
      sendEmail: true,
      sendPushNotifications: false
    },
    update: () => {}
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<SettingsRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('matches the last snapshot with iconName', () => {
    const renderer = new ReactShallowRenderer()

    const iconProps = {
      ...props,
      iconName: 'iconname'
    }

    renderer.render(<SettingsRow {...iconProps} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('matches snapshot when expanded', () => {
    const renderer = ReactTestRenderer.create(<SettingsRow {...props} />)
    const instance = renderer.getInstance()
    instance.setState({
      expanded: true
    })

    expect(renderer.toJSON()).toMatchSnapshot()
  })

  describe('toggleExpand', () => {
    it('updates the state', () => {
      const instance = ReactTestRenderer.create(<SettingsRow />).getInstance()
      instance.toggleExpand()
      expect(instance.state.expanded).toEqual(true)
    })
  })
})

describe('SettingsIcon', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      settingKey: 'sendEmail',
      settings: {
        sendEmail: true
      },
      name: 'FooRow',
      update: () => {}
    }

    renderer.render(<SettingsIcon {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
