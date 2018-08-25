import { azureRadiance } from 'style/colors'
import { Platform } from 'react-native'
export default {
  container: {
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  textInput: {
    flex: 1
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
