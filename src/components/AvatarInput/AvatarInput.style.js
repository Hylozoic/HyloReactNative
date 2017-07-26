import { Platform, StyleSheet } from 'react-native'

import { mercury } from '../../style/colors'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    shadowColor: mercury,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.1,

    // Android-only
    elevation: 2
  },
  input: {
    flex: 2,
    height: Platform.isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    marginLeft: 5
  }
})
