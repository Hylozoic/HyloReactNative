import { Platform } from 'react-native'

import { mercury } from '../../style/colors'

// Deliberately not a StyleSheet, too many calls to `flatten` required!
export default {
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
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Circular-Book',
    marginLeft: 5
  }
}
