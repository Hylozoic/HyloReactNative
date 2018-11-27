import { rhino50, ghost } from 'style/colors'
import { isIOS } from 'util/platform'

export default {
  cancelButton: {
    fontSize: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  searchBar: {
    flexDirection: 'row',
    borderColor: ghost,
    borderWidth: 1,
    borderRadius: 32,
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: 10,
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
  }
}
