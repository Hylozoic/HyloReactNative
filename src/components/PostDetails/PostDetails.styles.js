import mixins from '../../style/mixins'
import { capeCod10, mineralGreen } from '../../style/colors'

export default {
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 4,
    paddingRight: 4,
    ...mixins.justBelowNavigationBar
  },
  imageMargin: {
    marginBottom: 12
  },
  infoRow: {
    marginLeft: 12,
    marginRight: 12,
    borderTopWidth: 1,
    borderColor: capeCod10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    color: mineralGreen,
  },
  bottomInfoRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
  },
  infoRowLabel: {
    fontFamily: 'Circular-Bold',
    marginRight: 10
  },
  infoRowInfo: {
    fontFamily: 'Circular-Regular'
  }
}
