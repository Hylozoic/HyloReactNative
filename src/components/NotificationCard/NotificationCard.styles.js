import { StyleSheet } from 'react-native'

import { capeCod, nevada, rhino10, rhino30 } from 'style/colors'

export default StyleSheet.create({
  avatar: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5
  },
  container: {
    flexDirection: 'row',
    paddingTop: 15,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 15,
    paddingBottom: 15,
    borderBottomColor: rhino30,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  date: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginTop: 3
  },
  emphasize: {
    color: capeCod
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  highlight: {
    backgroundColor: rhino10
  },
  name: {
    color: nevada,
    fontFamily: 'Circular-Bold',
    fontSize: 14,
    marginTop: 3
  },
  separator: {
    borderBottomColor: rhino30,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  title: {
    fontFamily: 'Circular-Bold',
    fontSize: 14,
    color: capeCod,
    marginTop: 3
  },
  text: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: nevada,
    marginTop: 3
  }
})
