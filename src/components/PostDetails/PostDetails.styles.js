import { capeCod10, mineralGreen, rhino30, fuchsiaPink, prim, caribbeanGreen } from '../../style/colors'

export default {
  postCard: {
    marginBottom: 16
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  inlineEditor: {
    paddingHorizontal: 10,
    borderTopColor: rhino30,
    borderTopWidth: 0.25
  },
  files: {
    marginHorizontal: 12
  },
  joinButton: {
    backgroundColor: prim,
    color: fuchsiaPink,
    marginHorizontal: 12,
    marginVertical: 25
  },
  projectMembersContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: capeCod10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  memberCount: {
    color: caribbeanGreen
  }
}
