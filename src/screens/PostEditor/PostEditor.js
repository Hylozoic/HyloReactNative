/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useIsFocused } from '@react-navigation/native'
import { get, uniq, uniqBy, isEmpty, capitalize } from 'lodash/fp'
import moment from 'moment-timezone'
import { Validators } from 'hylo-shared'
import { isIOS } from 'util/platform'
import { showToast, hideToast } from 'util/toast'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
import { amaranth, caribbeanGreen, rhino30, white } from 'style/colors'
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

const titlePlaceholders = {
  discussion: "What's on your mind?",
  request: 'What are you looking for help with?',
  offer: 'What help can you offer?',
  resource: 'What resource is available?',
  project: 'What would you like to call your project?',
  event: 'What is your event called?'
}

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
      images: post?.imageUrls
        ? post
          .imageUrls
          .map(imageUrl => ({ remote: imageUrl, local: imageUrl }))
        : [],
      files: post?.fileUrls
        ? post
          .fileUrls
          .map(fileUrl => ({ remote: fileUrl, local: fileUrl }))
        : [],
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
      isValid: post?.id,
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

    this.removeBeforeRemove = this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      confirmDiscardChanges({
        onDiscard: () => this.props.navigation.dispatch(e.data.action),
        title: 'Are you sure?',
        confirmationMessage: 'If you made changes they will be lost.'
      })
    })

    this.renderReactNavigationHeader()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  componentWillUnmount () {
    this.removeBeforeRemove()
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
      files, images, title,
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
      fileUrls: uniq(files.filter(file => file.remote).map(file => file.remote)),
      imageUrls: uniq(images.filter(image => image.remote).map(image => image.remote)),
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      startTime: startTime && startTime.getTime(),
      endTime: endTime && endTime.getTime(),
      location,
      locationId: locationObject && locationObject.id !== 'NEW' && locationObject.id
    }

    try {
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
    // Note: Delegated to dismiss event listener
    this.props.navigation.goBack()
  }

  setIsSaving = isSaving => {
    this.setState({ isSaving }, this.setIsValid)
  }

  setIsValid = (updatedState = {}) => {
    const { type, title, groups, startTime, endTime, images, files } = Object.assign(
      {},
      this.state,
      updatedState
    )
    const imagesLoading = images.find(image => !image?.remote)
    const filesLoading = files.find(file => !file?.remote)

    if (
      imagesLoading ||
      filesLoading ||
      (!title || title.length < 1) ||
      isEmpty(groups) ||
      (type === 'event' && (!startTime || !endTime))
    ) {
      this.setState({ isValid: false }, this.renderReactNavigationHeader)
    } else {
      this.setState({ isValid: true }, this.renderReactNavigationHeader)
    }
  }

  handleUpdateType = type => {
    this.setState({ type }, this.setIsValid)
  }

  handleUpdateTitle = title => {
    switch (title.length >= MAX_TITLE_LENGTH) {
      case true:
        this.setState({ titleLengthError: true }, this.setIsValid)
        break
      case false:
        this.setState({ title, titleLengthError: false }, this.setIsValid)
        break
    }
  }

  handleUpdateDetails = details => {
    this.setState({ details }, this.setIsValid)
  }

  // Assumptions:
  // - maximum of three topics per post are allowed
  // - topics must be unique
  // - priority is given to topics already on the post (preserve order)
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

  handlePickLocation = locationObject => {
    this.setState(() => ({ location: locationObject.fullText, locationObject }))
  }

  handleUpdateProjectMembers = members => this.setState(state => ({ members }))

  handleAddGroup = group => {
    const groups = uniqBy(c => c.id, [...this.state.groups, group])

    this.setState({ groups }, this.setIsValid)
  }

  handleRemoveGroup = groupSlug => {
    this.setState(state => ({
      groups: state.groups.filter(group => group.slug !== groupSlug)
    }))
  }

  handleAddAttachmentForKey = key => ({ local, remote }) => {
    let attachmentsForKey = this.state[key] || []
    const existingIndex = attachmentsForKey.findIndex(attachment => attachment.local === local)

    if (existingIndex >= 0) {
      attachmentsForKey[existingIndex].remote = remote
    } else {
      attachmentsForKey = [...attachmentsForKey, { local, remote }]
    }

    // NOTE: `uniqBy` de-duping of local file uploads here won't do
    // anything at least in iOS, as each file selection is copied into
    // a unique `tmp` location on the device each time it's selected.
    this.setState({ [key]: uniqBy('local', attachmentsForKey) }, this.setIsValid)
  }

  handleRemoveAttachmentForKey = key => ({ local }) => {
    this.setState({ [key]: this.state[key].filter(attachment => attachment.local !== local) }, this.setIsValid)
  }

  handleAttachmentUploadErrorForKey = key => (errorMessage, attachment) => {
    this.handleRemoveAttachmentForKey(key)(attachment)
    Alert.alert(errorMessage)
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
      updateItems: this.handleUpdateProjectMembers,
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

  handleShowFilePicker = async () => {
    this.setState({ filePickerPending: true })
    await fileSelectorShowFilePicker({
      upload: this.props.upload,
      type: 'post',
      id: this.props?.post?.id,
      onAdd: this.handleAddAttachmentForKey('files'),
      onError: () => {
        this.setState({ filePickerPending: false }, this.setIsValid)
        this.handleAttachmentUploadErrorForKey('files')
      },
      onComplete: () => this.setState({ filePickerPending: false }, this.setIsValid),
      onCancel: () => this.setState({ filePickerPending: false }, this.setIsValid)
    })
  }

  toggleAnnouncement = () => {
    this.toast && hideToast(this.toast)
    this.toast = showToast(
      `announcement ${!this.state.announcementEnabled ? 'on' : 'off'}`,
      { isError: this.state.announcementEnabled }
    )
    this.setState({ announcementEnabled: !this.state.announcementEnabled })
  }

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  renderReactNavigationHeader = () => {
    const { navigation } = this.props

    navigation.setOptions({
      headerShown: true,
      header: this.renderHeader
    })
  }

  renderHeader = () => {
    const { isValid, isSaving, isNewPost, type } = this.state
    const headerRightButtonLabel = isSaving
      ? 'Saving...'
      : isNewPost
        ? 'Post'
        : 'Save'

    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.handleOnCancel}>
            <HeaderLeftCloseIcon
              style={styles.headerCloseIcon}
              color={rhino30}
              onPress={this.handleCancel}
            />
          </TouchableOpacity>
          <TypeSelector
            disabled={isSaving}
            onValueChange={this.handleUpdateType}
            placeholder={{}}
            value={type}
          />
          <Button
            style={styles.headerSaveButton}
            disabled={isSaving || !isValid}
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
      locationObject, topicsPicked, files, images
    } = this.state
    const canHaveTimeframe = type !== 'discussion'

    return (
      <>
        <View style={styles.formContent}>
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
              onChange={this.handleUpdateDetails}
              onAddTopic={!topicsPicked && this.handleAddTopic}
              readOnly={postLoading || isSaving}
              ref={this.detailsEditorRef}
              widthOffset={0}
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
                onSelect={startTime => this.setState({ startTime }, this.setIsValid)}
              />
              <DatePickerWithLabel
                style={styles.pressSelectionSection}
                label='End Time'
                disabled={!startTime}
                date={endTime}
                minimumDate={startTime || new Date()}
                onSelect={endTime => this.setState({ endTime }, this.setIsValid)}
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
              style={[styles.pressSelectionValue, { paddingRight: 40 }]}
              groups={groups}
              columns={1}
              onPress={this.handleShowGroupsEditor}
              onRemove={this.handleRemoveGroup}
              RemoveIcon={() => (
                <Icon name='Ex' style={styles.groupRemoveIcon} />
              )}
            />
          </TouchableOpacity>

          <BottomBar
            post={post}
            canModerate={canModerate}
            filePickerPending={filePickerPending}
            announcementEnabled={announcementEnabled}
            toggleAnnouncement={this.toggleAnnouncement}
            onShowFilePicker={this.handleShowFilePicker}
            onAddImage={this.handleAddAttachmentForKey('images')}
            onError={this.handleAttachmentUploadErrorForKey('images')}
          />
        </View>
        {!isEmpty(images) && (
          <ImageSelector
            onAdd={this.handleAddAttachmentForKey('images')}
            onRemove={this.handleRemoveAttachmentForKey('images')}
            images={images}
            style={styles.imageSelector}
            type='post'
          />
        )}

        {!isEmpty(files) && (
          <View>
            <FileSelector
              onRemove={this.handleRemoveAttachmentForKey('files')}
              files={files}
            />
          </View>
        )}
      </>
    )
  }

  render () {
    return (
      <KeyboardAvoidingView
        style={styles.formWrapper}
        behavior={isIOS ? 'padding' : null}
        keyboardVerticalOffset={isIOS ? 110 : 80}
      >
        <ScrollView
          ref={this.scrollViewRef}
          keyboardShouldPersistTaps='never'
          keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
          // Avoids a known issue on Android with overscroll and WebViews
          overScrollMode='never'
        >
          {this.renderForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export function TypeSelector (props) {
  return (
    <View style={styles.typeSelectorWrapper}>
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

export function BottomBar ({
  post, canModerate, filePickerPending, announcementEnabled,
  toggleAnnouncement, onShowFilePicker, onAddImage, onError
}) {
  // TODO: Tidy-up the styling below, move it into the stylesheet
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarLeft}>
        {!post?.id && canModerate && (
          <TouchableOpacity onPress={toggleAnnouncement} style={styles.bottomBarAnnouncement}>
            <Icon
              name='Announcement'
              style={styles.bottomBarAnnouncementIcon}
              color={announcementEnabled ? amaranth : caribbeanGreen}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomBarRight}>
        <TouchableOpacity onPress={onShowFilePicker}>
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
          onError={onError}
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
          <View style={[styleTemplate.expandIconWrapper, disabled && styleTemplate.disabled]}>
            <Icon name='ArrowDown' style={[styleTemplate.expandIcon, disabled && styleTemplate.disabled]} />
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
        title={label}
        confirmText='Set'
        cancelText='Clear'
        onConfirm={handleOnConfirm}
        onCancel={handleOnCancel}
      />
    </>
  )
}

// Other layout option for reference in the case of scroll issues:
//
// <FlatList
//   keyboardShouldPersistTaps='never'
//   keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
//   ListHeaderComponent={this.renderForm}
//   ListFooterComponent={this.renderFilesAndImages}
//   data={[]}
// />

// Using our "standard" React Navigation modal header:
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
//
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
//
//       return (
//         <ModalHeader {...props} {...headerProps} />
//       )
//     }
//   })
// }
