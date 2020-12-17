const goToMemberMaker = navigation => id =>
  navigation
    ? navigation.navigate('Member', { id })
    : () => {}

export default goToMemberMaker
