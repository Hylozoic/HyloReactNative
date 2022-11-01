import Avatar from 'components/Avatar'
import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { rhino30, white } from 'style/colors'

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

const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 }

const ImageViewerHeader = ({ creator, onRequestClose, title }) => (
  <SafeAreaView style={headerStyles.root}>
    <View style={headerStyles.container}>
      <View style={headerStyles.postDetails}>
        <View style={headerStyles.postDetailsTop}>
          <Avatar avatarUrl={creator.avatarUrl} dimension={28} />
          <View style={headerStyles.postDetailsNameAndDate}>
            <Text style={headerStyles.postDetailsName}>{creator.name}</Text>
            <Text style={headerStyles.postDetailsDate}>3w ago</Text>
          </View>
        </View>
        <Text style={headerStyles.postDetailsTitle}>{title}</Text>
      </View>
      <TouchableOpacity
        style={headerStyles.closeButton}
        onPress={onRequestClose}
        hitSlop={HIT_SLOP}
      >
        <Text style={headerStyles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
)

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
