import { havelockBlue, rhino80, rhino50, white } from '../../style/colors'

export default {
  sectionHeader: {
    paddingHorizontal: 10,
    marginTop: 10
  },
  sectionHeaderText: {
    color: rhino50,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },
  listHeader: {
    backgroundColor: white
  },
  listHeaderStatus: {
    paddingHorizontal: 10,
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
