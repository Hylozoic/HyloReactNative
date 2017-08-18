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
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',

    // Prevents the card from appearing upside down in the inverted FlatList
    transform: [{ scaleY: -1 }]
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
