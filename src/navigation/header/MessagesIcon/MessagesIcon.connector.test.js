import { mapStateToProps } from './MessagesIcon.connector'

describe('mapStateToProps', () => {
  const state = {
    orm: {
      Me: {
        items: ['1'],
        itemsById: {
          1: {
            unseenThreadCount: 12
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
