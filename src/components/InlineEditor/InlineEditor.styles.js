import { rhino30, azureRadiance } from 'style/colors'

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
    flex: 1
  },
  sendButton: {
    fontSize: 20,
    fontWeight: '400',
    paddingTop: 15,
    marginLeft: 10,
    width: 40
  },
  activeButton: {
    color: azureRadiance
  },
  toolbar: {
    flex: 1,
    paddingTop: 7,
    height: 0,
    flexDirection: 'row'
  },
  activeToolbar: {
    height: 37
  },
  toolbarButton: {
    paddingRight: 20,
    fontSize: 20,
    fontWeight: '700'
  }
}
