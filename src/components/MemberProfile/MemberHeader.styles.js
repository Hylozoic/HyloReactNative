import {
  capeCod, rhino80, rhino60, rhino50
} from '../../style/colors'

export default {
  header: {
    marginBottom: 15
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  name: {
    fontSize: 24,
    color: capeCod,
    fontFamily: 'Circular-Bold'
  },
  icons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    paddingLeft: 10
  },
  icon: {
    fontSize: 30,
    color: rhino60,
    marginRight: 10
  },
  lastIcon: {
    fontSize: 30,
    color: rhino60
  },
  location: {
    fontSize: 14,
    color: rhino50,
    fontFamily: 'Circular-Book',
    marginBottom: 2
  },
  tagline: {
    fontSize: 16,
    color: rhino80,
    fontFamily: 'Circular-Book'
  },
  control: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  editableControl: {
    marginBottom: 5
  },
  controlInput: {
    flex: 1
  },
  editIconWrapper: {
    marginRight: 10
  },
  editIcon: {
    color: rhino60,
    fontSize: 16
  }
}
