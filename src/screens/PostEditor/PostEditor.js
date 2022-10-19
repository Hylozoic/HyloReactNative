/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useIsFocused } from '@react-navigation/native'
import { get, uniq, uniqBy, isEmpty, capitalize } from 'lodash/fp'
import moment from 'moment-timezone'
import { Validators } from 'hylo-shared'
import { isIOS } from 'util/platform'
import { showToast, hideToast } from 'util/toast'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
import { pictonBlue, rhino30, white } from 'style/colors'
// import { ModalHeader } from 'navigation/headers'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
// TODO: Convert all 3 of the below to LocationPicker style calls
// ProjectMembers Chooser
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
// Topics Picker
import fetchTopicsForGroupId from 'store/actions/fetchTopicsForGroupId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'
// Group Chooser
import GroupChooserItemRow from 'screens/ItemChooser/GroupChooserItemRow'
import GroupsList from 'components/GroupsList'
// Components
import Button from 'components/Button'
import DatePicker from 'react-native-date-picker'
import FileSelector, { showFilePicker as fileSelectorShowFilePicker } from './FileSelector'
import HyloEditorWebView from 'screens/HyloEditorWebView'
import Icon from 'components/Icon'
import ImagePicker from 'components/ImagePicker'
import ImageSelector from './ImageSelector'
import ItemChooserItemRow from 'screens/ItemChooser/ItemChooserItemRow'
import Loading from 'components/Loading'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import styles, { typeSelectorStyles } from './PostEditor.styles'
import HeaderLeftCloseIcon from 'navigation/headers/HeaderLeftCloseIcon'
import confirmDiscardChanges from 'util/confirmDiscardChanges'

export default function (props) {
  const isFocused = useIsFocused()

  return <PostEditor {...props} isFocused={isFocused} />
}

export class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    const { post } = props
    this.scrollViewRef = React.createRef()
    this.detailsEditorRef = React.createRef()
    this.state = {
      isNewPost: !post?.id,
      title: post?.title || '',
      type: post?.type || 'discussion',
      groups: post?.groups || [],
      imageUrls: post?.imageUrls || [],
      fileUrls: post?.fileUrls || [],
      topics: post?.topics || [],
      members: post?.members || [],
      topicsPicked: false,
      announcementEnabled: false,
      detailsFocused: false,
      details: post?.details,
      titleLengthError: false,
      startTime: post?.startTime
        ? new Date(post.startTime)
        : null,
      endTime: post?.endTime
        ? new Date(post.endTime)
        : null,
      location: post?.location,
      locationObject: post?.locationObject,
      startTimeExpanded: false,
      endTimeExpanded: false,
      isSaving: false
    }
  }

  componentDidMount () {
    const { isNewPost } = this.state
    const { fetchPost, pollingFindOrCreateLocation, mapCoordinate } = this.props
    if (!isNewPost) {
      fetchPost()
    } else {
      if (mapCoordinate) {
        const locationObject = {
          fullText: `${mapCoordinate.lat},${mapCoordinate.lng}`,
          center: {
            lat: parseFloat(mapCoordinate.lat),
            lng: parseFloat(mapCoordinate.lng)
          }
        }
        pollingFindOrCreateLocation(locationObject, this.handlePickLocation)
      }
    }
    this.renderReactNavigationHeader()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  handleDetailsOnChange = details => {
    this.setState({ details })
  }

  handleTypeOnChange = type => {
    this.setState({ type }, this.renderReactNavigationHeader)
  }

  setIsSaving = isSaving => {
    this.setState({ isSaving }, this.renderReactNavigationHeader)
  }

  save = async () => {
    if (!this.detailsEditorRef?.current) {
      this.setIsSaving(false)
      return
    }

    const {
      createPost, createProject, updatePost,
      navigation, post
    } = this.props
    const {
      fileUrls, imageUrls, title,
      topics, type, announcementEnabled, members,
      groups, startTime, endTime, location,
      locationObject
    } = this.state
    const postData = {
      id: post.id,
      type,
      details: this.detailsEditorRef.current.getHTML(),
      groups,
      memberIds: members.map(m => m.id),
      fileUrls: uniq(fileUrls),
      imageUrls: uniq(imageUrls),
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      startTime: startTime && startTime.getTime(),
      endTime: endTime && endTime.getTime(),
      location,
      locationId: locationObject && locationObject.id !== 'NEW' && locationObject.id
    }

    try {
      if (!postData.title) {
        throw new Error('Title cannot be blank')
      }

      if (postData.title.length >= MAX_TITLE_LENGTH) {
        throw new Error(`Title cannot be more than ${MAX_TITLE_LENGTH} characters`)
      }

      if (isEmpty(postData.groups)) {
        throw new Error('You must select a group')
      }

      const saveAction = postData.id
        ? updatePost
        : postData.type === 'project'
          ? createProject
          : createPost
      const { payload, meta, error } = await saveAction(postData)

      if (error) {
        // TODO: handle API errors more appropriately
        throw new Error('Error submitting post')
      }

      const id = meta.extractModel?.getRoot(payload?.data)?.id

      navigation.navigate('Post Details', { id })
    } catch (e) {
      this.setIsSaving(false)
    }
  }

  handleSave = () => {
    const { announcementEnabled } = this.state
    // this.setState({ isSaving: true })
    this.setIsSaving(true)

    if (announcementEnabled) {
      Alert.alert(
        'MAKE AN ANNOUNCEMENT',
        'This means that all members of this group will receive an instant email and push notification about this Post. \n(This feature is available to moderators only.)',
        [
          {
            text: 'Send It',
            onPress: this.save
          },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => this.setIsSaving(false)
          }
        ])
    } else {
      this.save()
    }
  }

  handleCancel = () => {
    confirmDiscardChanges({ onDiscard: () => this.props.navigation.goBack() })
    // confirmDiscardChanges({
    //   title: '',
    //   confirmationMessage: "We're almost done, are you sure you want to cancel signing-up?",
    //   disgardButtonText: 'Yes',
    //   continueButtonText: 'No',
    //   onDiscard: () => {
    //     dispatch(logout())
    //     navigation.navigate('Signup Intro')
    //   }
    // })
  }

  handleAddImage = ({ local, remote }) => {
    // TODO: use `local` to avoid unnecessary network activity
    this.setState({
      imageUrls: uniq(this.state.imageUrls.concat(remote))
    })
  }

  handleRemoveImage = url => {
    this.setState(() => ({
      imageUrls: this.state.imageUrls.filter(u => u !== url)
    }))
  }

  handleAddFile = ({ local, remote }) => {
    this.setState(() => ({
      fileUrls: uniq(this.state.fileUrls.concat(remote))
    }))
  }

  handleAddGroup = group => {
    this.setState(state => ({
      groups: uniqBy(
        c => c.id,
        [...this.state.groups, group]
      )
    }))
  }

  handleRemoveGroup = groupSlug => {
    this.setState(state => ({
      groups: state.groups.filter(group => group.slug !== groupSlug)
    }))
  }

  handleRemoveFile = url => {
    this.setState({
      fileUrls: this.state.fileUrls.filter(u => u !== url)
    })
  }

  showAlert = msg => Alert.alert(msg)

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  // Assumptions:
  //  - a maximum of three topics per post are allowed
  //  - topics must be unique
  //  - priority is given to topics already on the post (preserve order)
  handleAddTopic = (providedTopic, picked) => {
    const topic = { ...providedTopic, name: this.ignoreHash(providedTopic.name) }

    if (Validators.validateTopicName(topic.name) === null) {
      this.setState({
        topics: uniqBy(t => t.name, [...this.state.topics, topic]).slice(0, 3),
        topicsPicked: picked !== undefined ? picked : this.state.topicsPicked
      })
    }
  }

  handleRemoveTopic = topicName => () => this.setState({
    topics: this.state.topics.filter(t => t !== topicName),
    topicsPicked: true
  })

  toggleAnnoucement = () => {
    this.toast && hideToast(this.toast)
    this.toast = showToast(`announcement ${!this.state.announcementEnabled ? 'on' : 'off'}`, { isError: this.state.announcementEnabled })
    this.setState({ announcementEnabled: !this.state.announcementEnabled })
  }

  handleUpdateTitle = title => {
    switch (title.length >= MAX_TITLE_LENGTH) {
      case true:
        this.setState({ titleLengthError: true })
        break
      case false:
        this.setState({ titleLengthError: false })
        this.setState({ title })
        break
    }
  }

  updateMembers = members => this.setState(state => ({ members }))

  handleDatePickerExpand = key => () => {
    this.scrollViewRef.current.scrollTo({ x: 20 })
    // this.scrollViewRef.current.scroll()
  }

  handleShowProjectMembersEditor = () => {
    const { navigation } = this.props
    const { members } = this.state
    const screenTitle = 'Project Members'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Type in the names of people to add to project',
      ItemRowComponent: ItemChooserItemRow,
      initialItems: members,
      updateItems: this.updateMembers,
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  handleShowTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for a topic by name',
      ItemRowComponent: TopicRow,
      pickItem: topic => { this.handleAddTopic(topic, true) },
      // FIX: Will only find topics for first group
      fetchSearchSuggestions: fetchTopicsForGroupId(get('[0].id', this.state.groups)),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  handleShowGroupsEditor = () => {
    const { navigation, groupOptions } = this.props
    const screenTitle = 'Post in Groups'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for group by name',
      defaultSuggestedItemsLabel: 'Your Groups',
      defaultSuggestedItems: groupOptions,
      ItemRowComponent: GroupChooserItemRow,
      pickItem: this.handleAddGroup,
      fetchSearchSuggestions: () => ({ type: 'none' }),
      getSearchSuggestions: (_, { autocomplete: searchTerm }) =>
        groupOptions.filter(c => c.name.toLowerCase().match(searchTerm?.toLowerCase()))
    })
  }

  handleShowLocationPicker = () => {
    LocationPicker({
      navigation: this.props.navigation,
      initialSearchTerm: this.state?.location,
      onPick: this.handlePickLocation
    })
  }

  handlePickLocation = locationObject => {
    this.setState(() => ({ location: locationObject.fullText, locationObject }))
  }

  handleShowFilePicker = async () => {
    this.setState({ filePickerPending: true })
    await fileSelectorShowFilePicker({
      upload: this.props.upload,
      type: 'post',
      id: this.props?.post?.id,
      onAdd: this.handleAddFile,
      onError: this.showAlert,
      onComplete: () => this.setState({ filePickerPending: false }),
      onCancel: () => this.setState({ filePickerPending: false })
    })
  }

  renderReactNavigationHeader = () => {
    const { navigation } = this.props

    navigation.setOptions({
      headerShown: true,
      header: this.renderHeader
    })
  }

  renderHeader = () => {
    const { isSaving, isNewPost, type } = this.state
    // const { navigation } = this.props
    const subject = capitalize(this.state?.type || '')
    const title = isNewPost
      ? `New ${subject}`
      : `Edit ${subject}`
    const headerRightButtonLabel = isSaving
      ? 'Saving...'
      : isNewPost
        ? 'Post'
        : 'Save'
    const styles1 = {
      headerContainer: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: rhino30
      },
      header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
      },
      headerCancelLink: {
        color: pictonBlue
      },
      headerSaveButton: {
        width: '25%',
        borderColor: 'transparent',
        // marginLeft: 'auto',
        // marginRight: 10,
        // marginBottom: 20,
        height: 35,
        fontSize: 16
      }
    }
    return (
      <View style={styles1.headerContainer}>
        <View style={styles1.header}>
          <TouchableOpacity onPress={this.handleOnCancel}>
            <HeaderLeftCloseIcon color={rhino30} onPress={this.handleCancel} />
            {/* <Text style={styles1.headerCancelLink}>Cancel</Text> */}
          </TouchableOpacity>
          <TypeSelector
            disabled={isSaving}
            onValueChange={this.handleTypeOnChange}
            placeholder={{}}
            value={type}
          />
          <Button
            style={styles1.headerSaveButton}
            onPress={this.handleSave}
            text={headerRightButtonLabel}
          />
        </View>
      </View>
    )
  }

  renderForm = () => {
    const { canModerate, post, postLoading } = this.props
    const {
      isSaving, topics, title, type, filePickerPending, announcementEnabled,
      titleLengthError, members, groups, startTime, endTime, location,
      locationObject, topicsPicked
    } = this.state
    const canHaveTimeframe = type !== 'discussion'

    return (
      <ScrollView
        ref={this.scrollViewRef}
        style={styles.scrollContainer}
        // May crash Android due to WebView editor without this
        overScrollMode='never'
      >
        <View style={styles.scrollContent}>
          {/* <TypeSelector
            disabled={isSaving}
            onValueChange={this.handleTypeOnChange}
            placeholder={{}}
            value={type}
          /> */}

          <View style={[styles.titleInputWrapper]}>
            <TextInput
              style={[styles.titleInput]}
              editable={!isSaving}
              onChangeText={this.handleUpdateTitle}
              placeholder={titlePlaceholders[type]}
              placeholderTextColor={rhino30}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              value={title}
              multiline
              numberOfLines={2}
              blurOnSubmit
              maxLength={MAX_TITLE_LENGTH}
            />
            {titleLengthError && (
              <Text style={styles.titleInputError}>😬 {MAX_TITLE_LENGTH} characters max</Text>
            )}
          </View>

          <View style={[styles.textInputWrapper, styles.detailsInputWrapper]}>
            <HyloEditorWebView
              placeholder='Add a description'
              contentHTML={post?.details}
              // groupIds={groupOptions && groupOptions.map(g => g.id)}
              onChange={this.handleDetailsOnChange}
              onAddTopic={!topicsPicked && this.handleAddTopic}
              readOnly={postLoading || isSaving}
              ref={this.detailsEditorRef}
              widthOffset={18}
              // Not setting a max height until ScrollView interaction is worked out better
              customEditorCSS={`
                min-height: 90px;
              `}
            />
          </View>

          <TouchableOpacity
            style={[styles.pressSelectionSection, styles.topics]}
            onPress={this.handleShowTopicsPicker}
          >
            <View style={styles.pressSelection}>
              <Text style={styles.pressSelectionLeft}>Topics</Text>
              <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.pressSelectionRightIcon} /></View>
            </View>
            <Topics onPress={this.handleRemoveTopic} topics={topics} />
          </TouchableOpacity>

          {type === 'project' && (
            <TouchableOpacity style={styles.pressSelectionSection} onPress={this.handleShowProjectMembersEditor}>
              <View style={styles.pressSelection}>
                <Text style={styles.pressSelectionLeft}>Project Members</Text>
                <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.pressSelectionRightIcon} /></View>
              </View>
              {members.length > 0 && <ProjectMembersSummary style={styles.pressSelectionValue} members={members} />}
            </TouchableOpacity>
          )}

          {canHaveTimeframe && (
            <>
              <DatePickerWithLabel
                style={styles.pressSelectionSection}
                label='Start Time'
                date={startTime}
                minimumDate={new Date()}
                onSelect={date => this.setState({ startTime: date })}
              />
              <DatePickerWithLabel
                style={styles.pressSelectionSection}
                label='End Time'
                disabled={!startTime}
                date={endTime}
                minimumDate={startTime || new Date()}
                onSelect={date => this.setState({ endTime: date })}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.pressSelectionSection, styles.topics]}
            onPress={this.handleShowLocationPicker}
          >
            <View style={styles.pressSelection}>
              <Text style={styles.pressSelectionLeft}>Location</Text>
              <View style={styles.pressSelectionRight}><Icon name='ArrowDown' style={styles.pressSelectionRightIcon} /></View>
            </View>
            {(location || locationObject) && (
              <Text style={styles.pressSelectionValue}>{location || locationObject.fullText}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pressSelectionSection}
            onPress={this.handleShowGroupsEditor}
          >
            <View style={styles.pressSelection}>
              <Text style={styles.pressSelectionLeft}>Post In</Text>
              <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.pressSelectionRightIcon} /></View>
            </View>
            <GroupsList
              style={[styles.pressSelectionValue, { paddingRight: 30 }]}
              groups={groups}
              columns={1}
              onPress={this.handleShowGroupsEditor}
              onRemove={this.handleRemoveGroup}
              RemoveIcon={() => (
                <Icon name='Ex' style={styles.groupRemoveIcon} />
              )}
            />
          </TouchableOpacity>

          <Toolbar
            post={post}
            canModerate={canModerate}
            filePickerPending={filePickerPending}
            announcementEnabled={announcementEnabled}
            toggleAnnoucement={this.toggleAnnoucement}
            onShowFilePicker={this.handleShowFilePicker}
            onAddImage={this.handleAddImage}
            showAlert={this.showAlert}
          />
        </View>
      </ScrollView>
    )
  }

  renderFilesAndImages = () => {
    const { fileUrls, imageUrls } = this.state

    return (
      <>
        {!isEmpty(imageUrls) && (
          <ImageSelector
            onAdd={this.handleAddImage}
            onRemove={this.handleRemoveImage}
            imageUrls={imageUrls}
            style={styles.imageSelector}
            type='post'
          />
        )}

        {!isEmpty(fileUrls) && (
          <View>
            <FileSelector
              onRemove={this.handleRemoveFile}
              fileUrls={fileUrls}
            />
          </View>
        )}
      </>
    )
  }

  render () {
    return (
      <FlatList
        keyboardShouldPersistTaps='never'
        keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
        ListHeaderComponent={this.renderForm}
        ListFooterComponent={this.renderFilesAndImages}
        data={[]}
      />
    )
  }
}

const titlePlaceholders = {
  discussion: "What's on your mind?",
  request: 'What are you looking for help with?',
  offer: 'What help can you offer?',
  resource: 'What resource is available?',
  project: 'What would you like to call your project',
  event: 'What is your event called?'
}

export function TypeSelector (props) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
      <RNPickerSelect
        {...props}
        style={typeSelectorStyles(props.value)}
        useNativeAndroidPickerStyle={false}
        pickerProps={{ itemStyle: { backgroundColor: white, letterSpacing: 2, fontWeight: 'bold', fontSize: 20 } }}
        items={
          ['Discussion', 'Request', 'Offer', 'Resource', 'Project', 'Event'].map(type => ({
            label: type.toUpperCase(),
            value: type.toLowerCase(),
            color: typeSelectorStyles(type.toLowerCase()).inputIOS.color
          }))
        }
        Icon={() => (
          <Icon name='ArrowDown' style={typeSelectorStyles(props.value).icon} />
        )}
      />
    </View>
  )
}

// TODO: Tidy this up
export function Toolbar ({
  post, canModerate, filePickerPending, announcementEnabled,
  toggleAnnoucement, onShowFilePicker, onAddImage, showAlert
}) {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarLeft}>
        {!post?.id && canModerate && (
          <TouchableOpacity onPress={toggleAnnoucement} style={styles.bottomBarAnnouncement}>
            <Icon
              name='Announcement'
              style={styles.bottomBarAnnouncementIcon}
              color={announcementEnabled ? 'caribbeanGreen' : 'rhino30'}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomBarRight}>
        <TouchableOpacity
          onPress={onShowFilePicker}>
          {filePickerPending && (
            <Loading
              size={30}
              style={[styles.bottomBarIcon, { marginRight: 15, padding: 8 }, styles.bottomBarIconLoading]}
            />
          )}
          {!filePickerPending && (
            <Icon
              name='Paperclip'
              style={[styles.bottomBarIcon, { marginRight: 20 }]}
            />
          )}
        </TouchableOpacity>
        <ImagePicker
          type='post'
          id={post?.id}
          selectionLimit={10}
          onChoice={onAddImage}
          onError={showAlert}
          renderPicker={loading => {
            if (!loading) {
              return (
                <Icon name='AddImage' style={styles.bottomBarIcon} />
              )
            } else {
              return (
                <Loading
                  size={30}
                  style={[styles.bottomBarIcon, { padding: 8 }, styles.bottomBarIconLoading]}
                />
              )
            }
          }}
        />

      </View>
    </View>
  )
}

export function Topics ({ onPress, topics }) {
  if (topics.length < 1) return null
  return (
    <ScrollView horizontal style={[styles.pressSelectionValue, styles.topicPillBox]}>
      {topics.map((t, i) => (
        <TopicPill key={i} topic={t} onPress={onPress(t)} />
      ))}
    </ScrollView>
  )
}

export function TopicPill ({ topic, topic: { name }, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.topicPill}>
      <Text style={styles.topicText}>#{name.toLowerCase()}</Text>
      <Icon name='Ex' style={styles.topicRemove} />
    </TouchableOpacity>
  )
}

export function DatePickerWithLabel ({
  date,
  minimumDate,
  label,
  onSelect,
  disabled,
  style,
  styleTemplate = {
    disabled: styles.pressDisabled,
    expandIconWrapper: styles.pressSelectionRight,
    expandIcon: styles.pressSelectionRightIcon,
    labelText: styles.pressSelectionLeft,
    labelWrapper: styles.pressSelection,
    valueText: styles.pressSelectionValue
  },
  dateFormat = 'MM/DD/YYYY LT z'
}) {
  const [open, setOpen] = useState(false)
  const handleOnPress = () => {
    !disabled && setOpen(true)
  }
  const handleOnConfirm = newDate => {
    onSelect(newDate)
    setOpen(false)
  }
  const handleOnCancel = () => {
    onSelect(null)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity style={style} onPress={handleOnPress}>
        <View style={styleTemplate.labelWrapper}>
          <Text style={[styleTemplate.labelText, disabled && styleTemplate.disabled]}>
            {label}
          </Text>
          <View style={styleTemplate.expandIconWrapper}>
            <Icon name='ArrowDown' style={styleTemplate.expandIcon} />
          </View>
        </View>
        {date && !open && (
          <Text style={styleTemplate.valueText}>{moment.tz(date, moment.tz.guess()).format(dateFormat)}</Text>
        )}
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        minimumDate={minimumDate}
        minuteInterval={5}
        date={date || new Date()}
        mode='datetime'
        confirmText={`Set ${label}`}
        onConfirm={handleOnConfirm}
        onCancel={handleOnCancel}
      />
    </>
  )
}

// renderReactNavigationHeader = () => {
//   const { isSaving, isNewPost } = this.state
//   const { navigation } = this.props
//   const subject = capitalize(this.state?.type || '')
//   const title = isNewPost
//     ? `New ${subject}`
//     : `Edit ${subject}`
//   const headerRightButtonLabel = isSaving
//     ? 'Saving...'
//     : isNewPost
//       ? 'Post'
//       : 'Save'
//   const headerProps = {
//     title,
//     headerLeftConfirm: true,
//     headerRightButtonLabel,
//     headerRightButtonOnPress: this.handleSave,
//     headerRightButtonDisabled: isSaving
//   }
//   navigation.setOptions({
//     headerShown: false,

//     header: props => {
//       const { isSaving, type } = this.state
//       const styles1 = {
//         headerSaveButton: {
//           width: '25%',
//           borderColor: 'transparent',
//           marginLeft: 'auto',
//           marginRight: 10,
//           marginBottom: 20,
//           height: 35,
//           fontSize: 14
//         }
//       }

//       return (
//         <ModalHeader {...props} {...headerProps} />
//       )
//     }
//   })
// }