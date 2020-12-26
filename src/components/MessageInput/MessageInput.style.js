import { mercury } from 'style/colors'

// Deliberately not a StyleSheet, too many calls to `flatten` required!
export default {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    shadowColor: mercury,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,

    // Android-only
    elevation: 2
  },
  input: {
    flex: 2,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Circular-Book',
    marginLeft: 5,
    paddingVertical: 0
  },
  sendButton: {
    fontSize: 36
  }
}
