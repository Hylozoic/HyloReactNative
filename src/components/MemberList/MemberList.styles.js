import { capeCod, rhino, rhino50, ghost } from 'style/colors'

export default {
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
  },
  listControls: {
    flex: 1,
    flexDirection: 'row'
  },
  searchWrapper: {
    marginTop: 10,
    marginHorizontal: 8,
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    height: 38,
    borderColor: ghost,
    borderRadius: 32
  },
  searchIcon: {
    top: 4,
    marginLeft: 5,
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
    flexDirection: 'row',
    flex: 1,
    width: 80,
    marginTop: 21,
    justifyContent: 'flex-end',
    marginRight: 8
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
  }
}
