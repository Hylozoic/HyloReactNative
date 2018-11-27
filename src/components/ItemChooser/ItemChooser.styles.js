import { caribbeanGreen, capeCod, capeCod10, capeCod20, capeCod40, rhino80, rhino50 } from '../../style/colors'
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
  personTextInput: {
    minWidth: screenWidth
  },
  person: {
    borderWidth: 1,
    borderColor: capeCod20,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    marginRight: 9,
    paddingLeft: 5,
    paddingRight: 10
  },
  personAvatar: {
    marginRight: 10
  },
  closeIcon: {
    paddingLeft: 15,
    fontSize: 20,
    color: rhino50
  },
  sectionHeader: {
    marginTop: 20
  },
  listLabel: {
    color: rhino80,
    fontSize: 18,
    fontFamily: 'Circular-Book',
    marginBottom: 20
  }
}
