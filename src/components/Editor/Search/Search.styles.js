import { rhino50 } from 'style/colors'

export default {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  inputWrapper: {
    height: 40,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: rhino50
  },
  inputIcon: {
    fontSize: 22,
    marginRight: 4
  },
  input: {
    flex: 1
  },
  resultsWrapper: {
    flex: 1
  },
  result: {
    container: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    avatar: {
      height: 32,
      width: 32,
      marginRight: 10,
      borderRadius: 16
    }
  }
}
