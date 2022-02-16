import { StyleSheet } from 'react-native'
import { capeCod, rhino30 } from 'style/colors'

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
  },
  date: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginTop: 3
  },
  marginTopNoCreator: {
    marginTop: 0
  },
  name: {
    color: capeCod,
    fontFamily: 'Circular-Bold'
  },
  padTopNoCreator: {
    paddingTop: 0
  },
  padLeftNoAvatar: {
    paddingLeft: 44
  }
})
