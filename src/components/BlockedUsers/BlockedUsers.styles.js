import { StyleSheet } from 'react-native'
import { rhino30, amaranth } from 'style/colors'

const row = {
  flexDirection: 'row'
}

export default {
  row,
  settingsRow: {
    marginHorizontal: 17
  },
  unBlockButton: {
    marginLeft: 'auto'
  },
  unBlockButtonText: {
    color: amaranth,
    fontFamily: 'Circular-Book'
  },
  noBlockedUsersMessage: {
    color: rhino30,
    marginTop: 10,
    marginLeft: 20
  },
  nameRow: {
    ...row,
    height: 38
  },
  avatarIcon: {
    fontSize: 26,
    color: rhino30,
    marginRight: 5
  },
  icon: {
    fontSize: 46,
    marginRight: 25,
    color: rhino30
  }
}
