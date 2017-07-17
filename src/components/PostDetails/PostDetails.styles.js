import { capeCod10, capeCod40, mineralGreen, mercury, nevada } from '../../style/colors'

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
    height: 50,
    borderRadius: 4,
    left: 0,
    right: 0,
    marginHorizontal: 8,
    paddingHorizontal: 7,
    paddingVertical: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    shadowColor: mercury,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.1
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 12
  },
  promptText: {
    fontSize: 14,
    color: nevada
  },
  placeholder: {
    fontStyle: 'italic',
    color: capeCod40
  }
}
