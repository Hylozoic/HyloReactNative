export function CommunityRow ({ communities }) {
  return <div styleName='communityRow'>
    {communities.map(community => <CommunityCell key={community.id} community={community} />)}
  </div>
}

export function CommunityCell ({ community }) {
  const { name, avatarUrl } = community
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)

  return <Link to={communityUrl(community.slug)} styleName='communityCell'>
    <div styleName='communityCellAvatar' style={imageStyle} />
    <span styleName='communityCellName'>{name}</span>
  </Link>
}
