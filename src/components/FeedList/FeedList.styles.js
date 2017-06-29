import { capeCod } from '../../style/colors'

const feedMargin = 16

export default {
  container: {
    backgroundColor: 'white'
  },
  listControls: {
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
    top: 2,
    marginLeft: 4
  },
  postRow: {
    paddingBottom: 15,
    marginRight: feedMargin,
    marginLeft: feedMargin
  }
}
