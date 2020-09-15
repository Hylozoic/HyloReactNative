import { capeCod10, rhino60, rhino30, fuchsiaPink, prim, caribbeanGreen } from '../../style/colors'

export default {
  postCard: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  postFooter: {
    borderTopColor: capeCod10,
    borderTopWidth: 1,
    paddingTop: 10
  },
  imageMargin: {
    marginBottom: 12
  },
  infoRow: {
    marginHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: capeCod10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoRowLabel: {
    fontSize: 13,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginRight: 3
  },
  infoRowInfo: {
    fontSize: 13,
    color: rhino60,
    fontFamily: 'Circular-Book'
  },
  inlineEditor: {
    marginBottom: 35,
    paddingTop: 10,
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
    marginBottom: 10
  },
  projectMembersContainer: {
    borderTopWidth: 1,
    borderColor: capeCod10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  memberCount: {
    color: caribbeanGreen
  }
}
