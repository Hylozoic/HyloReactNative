import 'react-native'
import showToast from './toast'
import Toast from 'react-native-root-toast'

describe('showToast', () => {
  it('shows a toast', () => {
    jest.spyOn(Toast, 'show')
    const toast = showToast('Cool Message')
    expect(Toast.show).toHaveBeenCalled()
    expect(toast).toBeDefined()
  })
})
