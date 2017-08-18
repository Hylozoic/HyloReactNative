import { capeCod, rhino, rhino50, ghost } from '../../../style/colors'

export default {
  container: {
    backgroundColor: '#FFF',
    height: 900
  },
  bannerContainer: {
    zIndex: 10
  },
  image: {
    height: 110
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
    marginTop: 16,
  },
  avatar: {
    width: 50,
    height: 50
  },
  memberName: {
    fontSize: 22,
    marginTop: 14,
    color: rhino,
    fontFamily: 'Circular-Black'
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
    flexDirection: 'row',
  },
  searchWrapper: {
    marginTop: 10,
    marginLeft: 8,
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    height: 38,
    borderColor: ghost,
    borderRadius: 32,
  },
  searchIcon: {
    top: 4,
    marginLeft: 5,
    color: rhino50
  },
  searchInput: {
    top: 1,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    flex: 1,
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
    fontFamily: 'Circular-Book',
  },
  downArrow: {
    top: 4,
    marginLeft: 4,
    fontSize: 12,
    color: capeCod,
  },
}
