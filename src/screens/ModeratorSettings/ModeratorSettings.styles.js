import { StyleSheet } from 'react-native'

import { caribbeanGreen, white, capeCod, capeCod05, capeCod40, amaranth, rhino20, white60onCaribbeanGreen } from 'style/colors'

export default StyleSheet.create({
  container: {
    backgroundColor: white
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: white
  },
  headerText: {
    backgroundColor: capeCod05,
    padding: 5,
    marginTop: 15,
    marginBottom: 10,
    width: '90%',
    textAlign: 'center',
    borderRadius: 4,
    color: capeCod,
    fontFamily: 'Circular-Bold',
    fontSize: 24
  },
  row: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: '5%',
    backgroundColor: white,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: rhino20
  },
  removeButton: {
    color: amaranth,
    fontFamily: 'Circular-Book',
    fontSize: 16
  },
  addNewContainer: {
    width: '90%',
    paddingVertical: 20,
    padding: 5
  },
  addNewButton: {
    padding: 5,
    fontSize: 18,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: caribbeanGreen,
    borderRadius: 4,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen,
    textAlign: 'center'
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
  },
  moderatorName: {
    flex: 1,
    fontFamily: 'Circular-Bold',
    fontSize: 18
  }
})
