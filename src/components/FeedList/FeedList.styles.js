import { capeCod } from '../../style/colors'
import { isIOS } from 'util/platform'

const feedMargin = 16

export default {
  container: {
    backgroundColor: 'white',
    minHeight: 100
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
  listControlsSingleItem: {
    justifyContent: 'flex-end'
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
