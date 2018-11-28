import { rhino50, havelockBlue } from 'style/colors'
import { isIOS } from 'util/platform'

export default {
  searchBar: {
    flexDirection: 'row',
    borderColor: rhino50,
    borderWidth: 1,
    borderRadius: 32,
    margin: 8,
    height: 38
  },
  searchIcon: {
    fontSize: 30,
    color: rhino50,
    backgroundColor: 'transparent',
    marginLeft: 5,
    top: 4
  },
  searchInput: {
    flex: 1,
    position: 'relative',
    top: isIOS ? 0 : 1,
    fontFamily: 'Circular-Book'
  },
  loading: {
    paddingHorizontal: 10
  },
  cancel: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  cancelButton: {
    fontSize: 20
  },
  cancelText: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    fontSize: 14,
    color: havelockBlue
  }
}
