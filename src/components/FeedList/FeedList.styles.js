import { capeCod } from 'style/colors'
import { isIOS } from 'util/platform'

const feedMargin = 16

export default {
  container: {
    backgroundColor: 'rgba(225, 229, 233, 0.3)',
    flex: 1
  },
  listControls: {
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: feedMargin,
    marginLeft: feedMargin
  },
  listControl: {
    flexDirection: 'row'
  },
  optionText: {
    fontSize: 12,
    color: capeCod
  },
  downArrow: {
    top: isIOS ? 2 : 4,
    marginLeft: 4
  }
}
