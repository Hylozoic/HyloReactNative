import { capeCod40 } from '../../style/colors'

export default {
  container: {
    marginBottom: 44
  },
  image: {
    height: 152
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    top: 75
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent'
  },
  icon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent'
  },
  postPrompt: {
    position: 'absolute',
    top: 122,
    marginLeft: 16,
    marginRight: 16,
    padding: 12,
    height: 60,
    borderRadius: 4,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 12
  },
  promptText: {
    color: capeCod40,
    fontSize: 15
  }
}
