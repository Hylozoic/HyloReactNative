const goToMemberMaker = (navigation, route) => id => {
  if (!navigation) return

  if (route?.name === 'Post Details - Modal') {
    navigation.navigate('Member - Modal', { id })
  } else {
    navigation.navigate('Member', { id })
  }
}

export default goToMemberMaker
