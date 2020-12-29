import { azureRadiance, gunsmoke, havelockBlue, white } from 'style/colors'
import { Platform } from 'react-native'

export default {
  container: {
    backgroundColor: 'white'
  },
  entryAndActions: {
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: white
  },
  textInput: {
    // paddingVertical: 0,
    flexGrow: 1,
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CCC',
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: 'top'
  },
  submitButton: {
    color: gunsmoke
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  toolbarButton: {
    marginTop: 10,
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
