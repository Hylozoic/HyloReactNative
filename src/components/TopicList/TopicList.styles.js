import { StyleSheet } from 'react-native'
import { rhino40, caribbeanGreen } from 'style/colors'

export default StyleSheet.create({
  container: {
    zIndex: 10,
    backgroundColor: 'white',
    flex: 1
  },
  detailIcon: {
    color: rhino40,
    marginRight: 5
  },
  detailText: {
    color: rhino40,
    fontFamily: 'Circular-Book',
    fontSize: 16,
    marginRight: 10
  },
  emptyList: {
    fontFamily: 'Circular-Book',
    fontSize: 16
  },
  hashtag: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Book',
    fontSize: 18,
    fontStyle: 'italic',
    paddingRight: 2
  },
  topicDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 7
  },
  topicList: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  topicName: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Book',
    fontSize: 18
  },
  topicRow: {
    marginBottom: 10,
    flexDirection: 'column'
  },
  topicTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
