const goToMemberMaker = navigation => id =>
  navigation
    ? navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'})
    : () => {}

export default goToMemberMaker
