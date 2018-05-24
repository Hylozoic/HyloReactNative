import { StyleSheet } from 'react-native'
import { capeCod40 } from 'style/colors'

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
  }
}
