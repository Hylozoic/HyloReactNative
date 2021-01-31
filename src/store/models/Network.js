import { Image } from 'react-native'
import { attr, Model, many } from 'redux-orm'
import allCommunitiesBannerImage from 'assets/all-communities-banner.png'
import allCommunitiesAvatarUrl from 'assets/All_Communities2.png'
import allCommunitieshHeaderAvatarUrl from 'assets/All_Communities.png'

export const ALL_COMMUNITIES_ID = 'all-communities'
export const ALL_COMMUNITIES_NETWORK = {
  id: ALL_COMMUNITIES_ID,
  slug: ALL_COMMUNITIES_ID,
  headerAvatarUrl: Image.resolveAssetSource(allCommunitieshHeaderAvatarUrl).uri,
  avatarUrl: Image.resolveAssetSource(allCommunitiesAvatarUrl).uri,
  bannerUrl: Image.resolveAssetSource(allCommunitiesBannerImage).uri,
  name: 'All Communities',
  communities: []
}

class Network extends Model {
  toString () {
    return `Network: ${this.name}`
  }
}

export default Network

Network.modelName = 'Network'

Network.fields = {
  id: attr(),
  name: attr(),
  posts: many('Post'),
  members: many('Person'),
  communities: many('Community')
}
