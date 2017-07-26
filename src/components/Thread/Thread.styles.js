import { Platform, StyleSheet } from 'react-native'

import { mercury } from '../../style/colors'

export default StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  input: {
    height: Platform.isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    paddingBottom: 4,
    borderRadius: 4,
    shadowColor: mercury,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.1,
    marginHorizontal: 8,
    marginBottom: 20,
    paddingHorizontal: 7,
    paddingVertical: 12,

    // Android-only
    elevation: 1
  }
})
