import React from 'react'
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { some } from 'lodash/fp'
import { showToast } from 'util/toast'
import { isIOS } from 'util/platform'
import Loading from 'components/Loading'
import ImagePicker from 'components/ImagePicker'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from 'assets/default-user-banner.jpg'
import styles from './GroupSettings.styles'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import Button from 'components/Button'
// Just straight from Web
import { useSelector } from 'react-redux'
import HyloWebView from 'screens/HyloWebView/HyloWebView'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export default function GroupSettings () {
  const group = useSelector(getCurrentGroup)

  if (!group) return <Loading />

  return (
    <HyloWebView path={`groups/${group?.slug}/settings`} />
  )
}


// export default class GroupSettings extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       edits: {},
//       changed: false
//     }
//   }

//   componentDidMount () {
//     this.props.fetchGroupSettings()
//     this.syncLocalFields()
//   }

//   componentDidUpdate (prevProps) {
//     if (prevProps.groupId !== this.props.groupId) {
//       this.props.fetchGroupSettings()
//     }

//     const hasChanged = key => prevProps.group[key] !== this.props.group[key]

//     if (some(hasChanged, ['name', 'description', 'location'])) {
//       this.syncLocalFields()
//     }
//   }

//   shouldComponentUpdate (nextProps) {
//     return nextProps.isFocused
//   }

//   syncLocalFields () {
//     const { group } = this.props
//     this.setState(() => ({
//       edits: {
//         name: group.name,
//         location: group.location,
//         description: group.description
//       }
//     }))
//   }

//   updateField = key => value => {
//     this.setState(() => ({
//       changed: true,
//       edits: {
//         ...this.state.edits,
//         [key]: value
//       }
//     }))
//   }

//   showLocationPicker = locationText => {
//     LocationPicker({
//       navigation: this.props.navigation,
//       initialSearchTerm: locationText,
//       onPick: location => {
//         this.updateField('location')(location?.fullText)
//         this.updateField('locationId')(location?.id)
//       }
//     })
//   }

//   saveChanges = () => {
//     return this.props.updateGroupSettings(this.state.edits)
//       .then(({ error }) => {
//         if (error) {
//           showToast('Error Saving Changes', { isError: true })
//         } else {
//           this.setState({ changed: false })
//           showToast('Saved')
//         }
//       })
//   }

//   render () {
//     const {
//       isFocused,
//       group,
//       updateGroupSettings
//     } = this.props

//     if (!group) return <Loading />

//     const { name, description, location } = this.state.edits

//     return (
//       <View style={styles.container}>
//         {/* <WebView
//           source={{ uri: `https://hylo.com/groups/${group?.slug}/settings` }}
//           style={{ marginTop: 0 }}
//         /> */}
//         <ScrollView>
//           <TextInput
//             style={styles.nameInput}
//             onChangeText={this.updateField('name')}
//             value={name}
//             underlineColorAndroid='transparent'
//           />
//           <GroupBanner
//             isFocused={isFocused}
//             group={group}
//             updateGroupSettings={updateGroupSettings}
//           />
//           <Text style={styles.label}>DESCRIPTION</Text>
//           <TextInput
//             style={styles.input}
//             value={description}
//             onChangeText={this.updateField('description')}
//             multiline
//             numberOfLines={5}
//             underlineColorAndroid='transparent'
//           />
//           <Text style={styles.label}>LOCATION</Text>
//           <TextInput
//             style={styles.input}
//             value={location}
//             onFocus={() => this.showLocationPicker(location)}
//             underlineColorAndroid='transparent'
//           />
//         </ScrollView>
//         <View style={styles.buttonBarContainer}>
//           <Button onPress={this.saveChanges} text='Save' style={styles.saveButton} />
//         </View>
//         {isIOS && <KeyboardSpacer />}
//       </View>
//     )
//   }
// }

// export class GroupBanner extends React.Component {
//   state = {
//     avatarPickerPending: false,
//     bannerPickerPending: false,
//     avatarLocalUri: null,
//     bannerLocalUri: null
//   }

//   onChoice ({ local, remote }, prefix) {
//     const localKey = `${prefix}LocalUri`
//     const remoteKey = `${prefix}Url`
//     this.setState({
//       [localKey]: local
//     })

//     this.props.updateGroupSettings({ [remoteKey]: remote })
//   }

//   render () {
//     const { group: { id, avatarUrl, bannerUrl } } = this.props
//     const { avatarPickerPending, bannerPickerPending, avatarLocalUri, bannerLocalUri } = this.state
//     const avatarSource = avatarLocalUri
//       ? { uri: avatarLocalUri }
//       : avatarUrl && { uri: avatarUrl }

//     // This is a suprisingly annoying piece of logic. Basically, prefer
//     // displaying `bannerLocalUri`, then `bannerUrl`, then `defaultBanner`.
//     // However, don't display `defaultBanner` only to be replaced with
//     // `bannerUrl` after the request finishes! The trick to it is this:
//     // `bannerUrl` will be undefined until the request finishes, then it should
//     // be either string or null. So we don't display the default unless it's null.

//     let bannerSource = {
//       uri: bannerLocalUri || bannerUrl
//     }
//     if (bannerUrl === null && bannerLocalUri === null) {
//       bannerSource = defaultBanner
//     }

//     return (
//       <View>
//         <ImagePicker
//           title='Change Banner'
//           type='groupBanner'
//           style={styles.bannerImagePicker}
//           id={id}
//           onChoice={choice => this.onChoice(choice, 'banner')}
//           onPendingChange={pending => this.setState({ bannerPickerPending: pending })}
//         >
//           <Image source={bannerSource} style={styles.bannerImage} />
//           <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />
//         </ImagePicker>
//         <View style={styles.avatarW3}>
//           <ImagePicker
//             style={styles.avatarWrapperWrapper}
//             title='Change Avatar'
//             type='groupAvatar'
//             id={id}
//             onChoice={choice => this.onChoice(choice, 'avatar')}
//             onPendingChange={pending => this.setState({ avatarPickerPending: pending })}
//           >
//             <View style={styles.avatarWrapper}>
//               <Image source={avatarSource} style={styles.avatarImage} />
//               <EditButton isLoading={avatarPickerPending} style={styles.avatarEditButton} />
//             </View>
//           </ImagePicker>
//         </View>
//       </View>
//     )
//   }
// }

// export function EditButton ({ isLoading, style }) {
//   return (
//     <View style={[styles.editButton, style]}>
//       {isLoading
//         ? <Text style={styles.editButtonText}>loading</Text>
//         : <View style={{ flexDirection: 'row' }}>
//           <EntypoIcon name='edit' style={styles.editIcon} />
//           <Text style={styles.editButtonText}>edit</Text>
//         </View>}
//     </View>
//   )
// }
