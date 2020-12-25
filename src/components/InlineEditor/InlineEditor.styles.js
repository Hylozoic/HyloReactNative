import { azureRadiance, gunsmoke, havelockBlue } from 'style/colors'
import { Platform } from 'react-native'

export default {
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  containerFocused: {
    // marginBottom: 30
  },
  entryAndActions: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textInput: {
  },
  submitButton: {
    // alignSelf: 'start',
    color: gunsmoke
  },
  submitButtonEditing: {
    // alignSelf: 'start'
    // alignSelf
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toolbarButton: {
    // marginTop: 10,
    marginRight: 20,
    fontSize: 20,
    fontWeight: '700',
    color: azureRadiance
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
