import { capeCod10, rhino60, rhino30, fuchsiaPink, prim, caribbeanGreen, white } from 'style/colors'

export default {
  container: {
    flex: 1,
    backgroundColor: white
  },
  postCard: {
    marginBottom: 16
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
