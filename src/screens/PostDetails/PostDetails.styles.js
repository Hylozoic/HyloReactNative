import { capeCod10, rhino60, rhino30, fuchsiaPink, prim, caribbeanGreen } from 'style/colors'

export default {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  postCard: {
    marginBottom: 16
  },
  postFooter: {
    // borderTopColor: capeCod10,
    // borderTopWidth: 1,
    // paddingTop: 10
  },
  imageMargin: {
    marginBottom: 12
  },
  infoRow: {
    paddingHorizontal: 12,
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
    marginRight: 5
  },
  locationIcon: {
    marginRight: 5
  },
  infoRowInfo: {
    fontSize: 13,
    color: rhino60,
    fontFamily: 'Circular-Book'
  },
  inlineEditor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 0,
    padding: 15
  },
  files: {
    marginHorizontal: 18,
    marginBottom: 18
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
