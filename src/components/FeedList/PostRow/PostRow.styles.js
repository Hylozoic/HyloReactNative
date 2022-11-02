import { StyleSheet } from 'react-native'

const feedMargin = 0

export default StyleSheet.create({
  postRow: {
    paddingBottom: 15,
    marginRight: feedMargin,
    marginLeft: feedMargin,

    // Card Box Shadow from Web:
    // 0 4px 10px rgba(35, 65, 91, 0.3)
    // https://ethercreative.github.io/react-native-shadow-generator
    shadowColor: 'rgba(35, 65, 91, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
})
