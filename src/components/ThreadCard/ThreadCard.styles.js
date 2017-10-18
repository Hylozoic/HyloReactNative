import { StyleSheet } from 'react-native'
import { jade } from 'style/colors'

export default {
  firstThreadAvatar: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 8
  },
  threadAvatars: {
    marginLeft: 10,
    marginTop: -20,
    marginRight: 8
  },
  threadCard: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    backgroundColor: 'white'
  },
  lastCard: {
    borderColor: '#FFF'
  },
  header: {
    marginTop: 7,
    fontWeight: 'bold'
  },
  footer: {
    fontSize: 12
  },
  body: {
    marginRight: 30
  },
  messageContent: {
    flex: 1,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  count: {
    backgroundColor: jade,
    borderRadius: 100,
    height: 34,
    width: 34,
    paddingTop: 5,
    marginTop: -20,
    marginLeft: 10
  },
  countText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Circular-Bold',
    overflow: 'hidden',
    backgroundColor: 'transparent'
  }
}
