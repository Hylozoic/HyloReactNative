import { rhino30, azureRadiance } from 'style/colors'
import { Platform } from 'react-native'
export default {
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    borderTopColor: rhino30,
    borderTopWidth: 0.25
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  textInput: {
    flex: 1
  },
  sendButton: {
    fontSize: 20,
    fontWeight: '400'
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    alignItems: 'flex-end',
    paddingBottom: 10,
    flexDirection: 'row'
  },
  toolbarButton: {
    paddingRight: 20,
    fontSize: 20,
    fontWeight: '700'
  },
  search: {
    ...Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {
        paddingTop: 0
      }
    })
  }
}
