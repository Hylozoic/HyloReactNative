import { StyleSheet } from 'react-native'
import { white, amaranth, rhino20 } from 'style/colors'

export default StyleSheet.create({
  container: {
    backgroundColor: white,
    paddingHorizontal: 10,
    flex: 1
  },
  moderatorsList: {},
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: rhino20
  },
  removeButton: {
    color: amaranth,
    fontFamily: 'Circular-Book',
    fontSize: 16
  },
  buttonBarContainer: {    
    paddingBottom: 40,
    alignItems: 'flex-end'
  },
  addNewButton: {
    fontSize: 18,
    height: 40,
    width: 200
  },
  moderatorName: {
    flex: 1,
    fontFamily: 'Circular-Bold',
    fontSize: 18
  }
})
