const goToMemberMaker = navigation => id =>
  navigation
    ? navigation.navigate('MemberProfile', { id })
    : () => {}

export default goToMemberMaker
