import { Dimensions } from 'react-native'

export default imageCount => {
  const containerWidth = Dimensions.get('window').width - 25
  const imageMargin = 5
  const minImageWidth = 100
  const minImageWithWithMargin = minImageWidth + imageMargin
  const maxImagesPerRow = (containerWidth / minImageWithWithMargin) > 0
    ? (containerWidth / minImageWithWithMargin)
    : 1
  const imageWidth = imageCount > maxImagesPerRow
    ? containerWidth / maxImagesPerRow
    : (containerWidth / imageCount)

  return {
    imageGrid: {
      paddingHorizontal: 10
    },
    image: {
      marginRight: imageMargin,
      width: imageWidth,
      height: imageWidth,
      resizeMode: 'cover',
      borderRadius: 4
    }
  }
}
