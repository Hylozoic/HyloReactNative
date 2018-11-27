import { rhino50, ghost } from 'style/colors'
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
  cancelButton: {
    fontSize: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  }
}
