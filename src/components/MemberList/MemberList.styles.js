import { capeCod, rhino, rhino50, ghost } from 'style/colors'

export default {
  listControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 5
  },
  searchWrapper: {
    marginRight: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    borderWidth: 1,
    padding: 3,
    borderColor: rhino50,
    borderRadius: 32
  },
  searchIcon: {
    marginLeft: 2,
    color: rhino50,
    backgroundColor: 'transparent'
  },
  searchInput: {
    top: 1,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    flex: 1
  },
  sortBy: {
    flexDirection: 'row'
  },
  sortByText: {
    color: rhino,
    fontFamily: 'Circular-Book'
  },
  downArrow: {
    top: 4,
    marginLeft: 4,
    fontSize: 12,
    color: capeCod
  },
  // Member cells/cards
  cell: {
    flex: 1,
    margin: 8,
    alignItems: 'center'
  },
  memberCell: {
    backgroundColor: '#FFF',
    borderColor: '#EAEBEB',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4
  },
  avatarSpacing: {
    marginTop: 16
  },
  memberName: {
    fontSize: 18,
    marginTop: 14,
    color: rhino,
    fontFamily: 'Circular-Black',
    textAlign: 'center'
  },
  memberLocation: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    textAlign: 'center',
    color: ghost
  },
  memberBio: {
    fontFamily: 'Circular-Book',
    color: rhino50,
    textAlign: 'center',
    padding: 10
  }
}
