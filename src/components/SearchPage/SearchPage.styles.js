import { StyleSheet } from 'react-native'
import { capeCod40, rhino, rhino60, capeCod10 } from 'style/colors'

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
    marginBottom: cardMargin,
    paddingHorizontal: cardPadding,
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
  },
  postWrapper: {
    marginHorizontal: cardMargin,
    marginBottom: cardMargin
  },
  commentWrapper: {
    marginHorizontal: cardMargin,
    marginBottom: cardMargin,
    borderWidth: 1,
    borderColor: capeCod10,
    borderRadius: 4
  },
  postTitle: {
    paddingHorizontal: cardPadding
  },
  commentPostHeader: {
    opacity: 0.4
  },
  commentDivider: {
    marginHorizontal: cardMargin,
    borderBottomWidth: 1,
    borderBottomColor: capeCod10,
    marginTop: 9,
    marginBottom: 21
  }
}
