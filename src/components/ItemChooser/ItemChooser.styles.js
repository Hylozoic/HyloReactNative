import { caribbeanGreen, havelockBlue, capeCod, capeCod10, capeCod20, capeCod40, ghost, rhino80, rhino50 } from '../../style/colors'
import { Dimensions } from 'react-native'
import { isIOS } from 'util/platform'

const screenWidth = Dimensions.get('window').width

const messagePromptShape = {
  height: 52,
  borderRadius: 4,
  left: 0,
  right: 0,
  flex: 1
}

const defaultPadding = {
  paddingHorizontal: 12
}

export default {
  sectionList: {
    ...defaultPadding,
    borderTopWidth: isIOS ? 0 : 1,
    borderTopColor: capeCod20
  },
  personInputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: capeCod20,
    minWidth: screenWidth
  },
  sectionHeader: {
    marginTop: 20
  },
  listLabel: {
    color: rhino80,
    fontSize: 18,
    fontFamily: 'Circular-Book',
    marginBottom: 20
  },
  listHeader: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  listHeaderText: {
    fontWeight: 'bold',
    color: rhino80,
    flex: 1
  },
  listHeaderClear: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    fontSize: 14,
    color: havelockBlue
  }
}
