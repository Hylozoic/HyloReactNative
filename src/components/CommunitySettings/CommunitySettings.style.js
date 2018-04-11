import { StyleSheet } from 'react-native'
import { capeCod40, capeCod20, white } from 'style/colors'

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
    backgroundColor: '#FAFBFC',
    padding: 20,
    width: '90%',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 8,
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
    fontSize: 20,
    flex: 1
  },
  chevron: {
    fontSize: 24,
    color: capeCod20
  }
}
