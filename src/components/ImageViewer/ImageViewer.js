import { useState } from 'react'
import { isEmpty } from 'lodash/fp'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Avatar from 'components/Avatar'
import ImageView from 'react-native-image-viewing'
import { rhino30, white } from 'style/colors'

export function ImageViewerButton ({
  creator,
  images,
  title,
  renderImages,
  children,
  ...touchableHighlightProps
}) {
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (isEmpty(images) || !(renderImages || children)) return null

  const toggleImageViewerVisible = () => setImageViewerVisible(!imageViewerVisible)
  const showImageViewerAtIndex = imageIndex => {
    return () => {
      setSelectedImageIndex(imageIndex)
      toggleImageViewerVisible()
    }
  }

  return (
    <>
      {renderImages && (
        <TouchableHighlight {...touchableHighlightProps} onPress={showImageViewerAtIndex(0)}>
          {renderImages(showImageViewerAtIndex)}
        </TouchableHighlight>
      )}
      {!renderImages && children && (
        <TouchableHighlight {...touchableHighlightProps} onPress={showImageViewerAtIndex(0)}>
          {children}
        </TouchableHighlight>
      )}
      <ImageViewer
        creator={creator}
        imageIndex={selectedImageIndex}
        images={images}
        onRequestClose={toggleImageViewerVisible}
        title={title}
        visible={imageViewerVisible}
      />
    </>

  )
}

export default function ImageViewer ({
  creator,
  images,
  onRequestClose,
  title,
  ...forwardedProps
}) {
  return (
    <ImageView
      images={images}
      HeaderComponent={
          ({ imageIndex }) => {
            return (
              <ImageViewerHeader
                creator={creator}
                onRequestClose={onRequestClose}
                title={title}
              />
            )
          }
      }
      FooterComponent={({ imageIndex }) => (
        <ImageViewerFooter
          imageIndex={imageIndex}
          imagesCount={images.length}
        />
      )}
      onRequestClose={onRequestClose}
      {...forwardedProps}
    />
  )
}

const ImageViewerHeader = ({ creator, onRequestClose, title }) => {
  return (
    <SafeAreaView style={headerStyles.root}>
      <View style={headerStyles.container}>
        <View style={headerStyles.postDetails}>
          <View style={headerStyles.postDetailsTop}>
            {creator && (
              <>
                <Avatar avatarUrl={creator.avatarUrl} dimension={28} />
                <View style={headerStyles.postDetailsNameAndDate}>
                  <Text style={headerStyles.postDetailsName}>{creator.name}</Text>
                  <Text style={headerStyles.postDetailsDate}>3w ago</Text>
                </View>
              </>
            )}
          </View>
          {title && (
            <Text style={headerStyles.postDetailsTitle}>{title}</Text>
          )}
        </View>
        <TouchableOpacity
          style={headerStyles.closeButton}
          onPress={onRequestClose}
          hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
        >
          <Text style={headerStyles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const headerStyles = StyleSheet.create({
  root: {
    backgroundColor: '#00000077'
  },
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  postDetails: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5
  },
  postDetailsTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  postDetailsNameAndDate: {
    marginLeft: 10
  },
  postDetailsName: {
    color: white,
    fontFamily: 'Circular-Bold'
  },
  postDetailsDate: {
    color: white,
    fontSize: 12
  },
  postDetailsTitle: {
    color: white,
    marginLeft: 0,
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Circular-Bold'
  },

  closeButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 8
  },
  closeText: {
    fontSize: 24,
    includeFontPadding: false,
    color: rhino30
  }
})

export const ImageViewerFooter = ({ imageIndex, imagesCount }) => {
  if (imagesCount < 2) return null

  return (
    <View style={footerStyles.root}>
      <Text style={footerStyles.text}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
    </View>
  )
}

const footerStyles = StyleSheet.create({
  root: {
    height: 64,
    backgroundColor: '#00000077',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 17,
    color: '#FFF'
  }
})
