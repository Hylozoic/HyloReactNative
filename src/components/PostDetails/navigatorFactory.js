export const goToMemberMaker = ({ navigate }) => id =>
  navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'})