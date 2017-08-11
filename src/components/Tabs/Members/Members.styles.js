import { capeCod } from '../../../style/colors'

export default {
  container: {
    backgroundColor: '#FFF'
  },
  bannerContainer: {
    zIndex: 10
  },
  image: {
    height: 100
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    top: 60
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent'
  },
  cell: {
    flex: 1,
    margin: 8,
    height: 100,
    alignItems: 'center'
  },
  memberCell: {
    backgroundColor: '#FFF',
    borderColor: '#EAEBEB',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4
  },
  listControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 16,
    marginLeft: 16
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
}
