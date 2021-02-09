import { StyleSheet } from 'react-native'
import { capeCod40, capeCod20, capeCod05, rhino, white } from 'style/colors'

export default {
  container: {
    backgroundColor: white,
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: white
  },
  headerText: {
    color: rhino,
    paddingVertical: 20,
    width: '90%',
    textAlign: 'left',
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 4,
    fontFamily: 'Circular-Bold',
    fontSize: 28
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '90%',
    marginLeft: '5%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: capeCod40
  },
  text: {
    fontSize: 18,
    flex: 1
  },
  chevron: {
    fontSize: 24,
    color: capeCod20
  }
}
