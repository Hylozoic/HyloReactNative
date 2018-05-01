import { caribbeanGreen, white, capeCod40, amaranth, rhino20, white60onCaribbeanGreen } from 'style/colors'

export default {
  container: {
    backgroundColor: white
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: white
  },
  headerText: {
    backgroundColor: '#FAFBFC',
    padding: 20,
    width: '90%',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontFamily: 'Circular-Book',
    fontSize: 24
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: white,
    flex: 1
  },
  removeButton: {
    color: amaranth
  },
  addNewContainer: {
    width: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginTop: 10
  },
  addNewButton: {
    padding: 10,
    fontSize: 18,
    borderStyle: 'dashed',
    borderColor: white60onCaribbeanGreen,
    borderWidth: 2,
    fontFamily: 'Circular-Bold',
    color: caribbeanGreen,
    textAlign: 'center'
  },
  addModeratorContainer: {
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%'
  },
  addModeratorButtonsContainer: {
    flexDirection: 'row'
  },
  button: {
    paddingLeft: 15,
    paddingTop: 10
  },
  cancelButton: {
    fontFamily: 'Circular-Bold',
    color: capeCod40
  },
  addButton: {
    fontFamily: 'Circular-Bold',
    color: caribbeanGreen
  },
  autocomplete: {
    flex: 1
  },
  autocompleteContainer: {
    borderWidth: 0,
    flex: 1
  },
  autocompleteInput: {
    borderWidth: 0,
    flex: 1
  },
  autocompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  }
}
