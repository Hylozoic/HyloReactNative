import { Linking } from 'react-native'
import { openURL } from 'navigation/linking'

describe('openURL', () => {
  it('calls Linking.openURL', () => {
    const url = 'http://www.goodlink.com'
    openURL(url)
      .then(() => {
        expect(Linking.canOpenURL).toHaveBeenCalled()
        expect(Linking.openURL).toHaveBeenCalledWith(url)
      })
  })
})
