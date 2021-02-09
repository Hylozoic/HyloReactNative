import { Image } from 'react-native'
import { attr, Model, many } from 'redux-orm'
import allGroupsBannerImage from 'assets/all-groups-banner.png'
import allGroupsAvatarUrl from 'assets/All_Groups2.png'
import allGroupshHeaderAvatarUrl from 'assets/All_Groups.png'

export const ALL_COMMUNITIES_ID = 'all-groups'
export const ALL_COMMUNITIES_NETWORK = {
  id: ALL_COMMUNITIES_ID,
  slug: ALL_COMMUNITIES_ID,
  headerAvatarUrl: Image.resolveAssetSource(allGroupshHeaderAvatarUrl).uri,
  avatarUrl: Image.resolveAssetSource(allGroupsAvatarUrl).uri,
  bannerUrl: Image.resolveAssetSource(allGroupsBannerImage).uri,
  name: 'All Groups',
  groups: []
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
  groups: many('Group')
}
