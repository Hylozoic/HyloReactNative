import { capeCod10, capeCod40, mineralGreen } from '../../style/colors'

export default {
  postCard: {
    marginBottom: 16
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 4,
    paddingRight: 4
  },
  imageMargin: {
    marginBottom: 12
  },
  infoRow: {
    marginLeft: 12,
    marginRight: 12,
    borderTopWidth: 1,
    borderColor: capeCod10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomInfoRow: {
    marginBottom: 15,
    borderBottomWidth: 1
  },
  infoRowLabel: {
    fontSize: 14,
    color: mineralGreen,
    fontFamily: 'Circular-Bold',
    marginRight: 10
  },
  infoRowInfo: {
    fontSize: 14,
    color: mineralGreen,
    fontFamily: 'Circular-Regular'
  },
  commentPrompt: {
    position: 'absolute',
    top: 122,
    height: 50,
    borderRadius: 4,
    left: 0,
    right: 0,
    marginLeft: 16,
    marginRight: 16,
    padding: 12,
    backgroundColor: 'white',
    borderColor: capeCod10,
    justifyContent: 'center'
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
    fontSize: 15,
    fontStyle: 'italic'
  }
}
