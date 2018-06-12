import { rhino30, azureRadiance } from 'style/colors'
import { Platform } from 'react-native'
export default {
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    borderTopColor: rhino30,
    borderTopWidth: 0.25
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    paddingBottom: 40
  },
  sendButton: {
    fontSize: 20,
    fontWeight: '400'
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    flex: 1,
    top: -28,
    alignItems: 'flex-end',
    height: 0,
    flexDirection: 'row'
  },
  activeToolbar: {
    height: 20
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
