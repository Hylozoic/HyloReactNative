import { azureRadiance, gunsmoke, rhino05, rhino60, white } from 'style/colors'

export default {
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: rhino05,
    padding: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  textInputAndTools: {
    backgroundColor: white,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxHeight: 200
  },
  textInput: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    padding: 0,
    fontSize: 16,
    textAlignVertical: 'top'
  },
  toolbar: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-end'
  },
  toolbarButton: {
    alignSelf: 'flex-end',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '700',
    color: rhino60
  },
  submitButton: {
    marginLeft: 10,
    marginBottom: 8,
    color: gunsmoke,
  },
  activeButton: {
    color: azureRadiance
  }
}
