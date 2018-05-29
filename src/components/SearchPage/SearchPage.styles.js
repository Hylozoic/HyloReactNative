import { StyleSheet } from 'react-native'
import { capeCod40, rhino, rhino60 } from 'style/colors'

const cardMargin = 15
const cardPadding = 10

const row = {
  flexDirection: 'row'
}

export default {
  scrollContainer: {

  },
  row,
  searchBar: {
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40,
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  searchBox: {
    ...row,
    alignItems: 'center',
    height: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: capeCod40,
    borderRadius: 100
  },
  searchIcon: {
    color: capeCod40,
    fontSize: 26,
    marginHorizontal: 5
  },
  textInput: {
    flex: 1
  },
  personCard: {
    ...row,
    height: 60,
    alignItems: 'center',
    marginHorizontal: cardMargin,
    paddingHorizontal: cardPadding,
    // paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40
  },
  avatar: {
    marginRight: 8
  },
  nameAndLocation: {
    justifyContent: 'space-between'
  },
  name: {
    color: rhino,
    fontSize: 16,
    paddingBottom: 4
  },
  location: {
    color: rhino60,
    fontSize: 12
  }
}
