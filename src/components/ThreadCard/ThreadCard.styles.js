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
    borderRadius: 100,
    backgroundColor: jade,
    color: 'white',
    textAlign: 'center',
    fontWeight: '900',
    height: 34,
    width: 34,
    paddingTop: 5,
    marginTop: -20,
    marginLeft: 10
  }
}
