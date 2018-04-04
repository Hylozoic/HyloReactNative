import { capeCod, rhino, rhino50, ghost, white } from '../../../style/colors'

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: 0, height: 2},
  textShadowRadius: 7
}

const bannerHeight = 132

export default {
  container: {
    backgroundColor: '#FFF'
  },
  bannerContainer: {
    zIndex: 10,
    height: bannerHeight
  },
  image: {
    height: bannerHeight,
    width: '100%',
    position: 'absolute'
  },
  gradient: {
    height: bannerHeight,
    width: '100%',
    position: 'absolute'
  },
  titleRow: {
    top: 46,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16
  },
  name: {
    fontSize: 24,
    fontFamily: 'Circular-Black',
    color: white,
    backgroundColor: 'transparent',
    ...hasTextShadow
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
    marginTop: 16
  },
  avatar: {
    width: 50,
    height: 50
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
    marginLeft: 8,
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
  },
  button: {
    width: 185,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
    marginTop: 12,
    fontSize: 14
  }
}
