import { StyleSheet } from 'react-native'
import { caribbeanGreen, capeCod10, limedSpruce, nevada, rhino60 } from 'style/colors'

export default {
  threadCard: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    backgroundColor: 'white'
  },
  header: {
    marginTop: 7,
    fontFamily: 'Circular-Bold',
    color: limedSpruce,
    fontSize: 14,
    marginBottom: 7
  },
  footer: {
    fontSize: 12
  },
  body: {
    marginRight: 30,
    marginBottom: 3,
    fontFamily: 'Circular-Book',
    color: nevada,
    fontSize: 14
  },
  date: {
    fontFamily: 'Circular-Book',
    color: rhino60,
    fontSize: 12
  },
  messageContent: {
    flex: 1,
    paddingBottom: 17,
    marginBottom: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: capeCod10
  },
  count: {
    backgroundColor: caribbeanGreen,
    borderRadius: 100,
    height: 34,
    width: 34,
    marginTop: -20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  countText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Circular-Bold',
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },
  threadAvatars: {
    marginRight: 3
  },
  firstThreadAvatar: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 8
  },
  restThreadAvatars: {
    marginLeft: 10,
    marginTop: -20,
    marginRight: 8
  }
}
