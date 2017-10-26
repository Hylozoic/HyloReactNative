import { mapStateToProps } from './NotificationsIcon.connector'

describe('mapStateToProps', () => {
  const state = {
    orm: {
      Me: {
        items: ['1'],
        itemsById: {
          1: {
            newNotificationCount: 12
          }
        },
        meta: {
          maxId: 1
        }
      }
    }
  }
  it('returns showBadge', () => {
    const stateProps = mapStateToProps(state, {})
    expect(stateProps.showBadge).toEqual(true)
  })
})
