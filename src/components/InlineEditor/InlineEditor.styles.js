import { azureRadiance } from 'style/colors'
import { Platform } from 'react-native'

export default {
  container: {
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  wrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    alignItems: 'flex-end',
    paddingTop: 5,
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
