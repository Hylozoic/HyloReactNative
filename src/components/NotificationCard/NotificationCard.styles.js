import { StyleSheet } from 'react-native'

import { capeCod, nevada, rhino30 } from 'style/colors'

export default StyleSheet.create({
  avatar: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 8
  },
  body: {
    flexDirection: 'column',
    flex: 0.9,
    paddingLeft: 10
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'column'
  },
  date: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginTop: 3
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  name: {
    color: capeCod,
    fontFamily: 'Circular-Bold'
  },
  text: {
    fontFamily: 'Circular-Book',
    color: nevada,
    marginTop: 3
  }
})
