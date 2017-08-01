import { StyleSheet } from 'react-native'

import { rhino30 } from '../../style/colors'

export default StyleSheet.create({
  body: {
    flexDirection: 'column',
    flex: 0.9,
    paddingLeft: 10
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white'
  },
  date: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginTop: 3
  },
  name: {
    color: '#363D3C',
    fontFamily: 'Circular-Bold'
  },
  text: {
    fontFamily: 'Circular-Book',
    color: '#5D757A',
    marginTop: 3
  }
})
