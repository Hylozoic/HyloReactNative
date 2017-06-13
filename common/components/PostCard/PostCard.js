/* eslint-disable camelcase */
import React from 'react'
import { View, Image } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostFooter from './PostFooter'
import samplePost, { SAMPLE_IMAGE_URL } from './samplePost'
import { get } from 'lodash/fp'

const { shape, any, object, string, func, array, bool } = React.PropTypes

export default class PostCard extends React.Component {
  static propTypes = {
    post: shape({
      id: any,
      type: string,
      creator: object,
      name: string,
      details: string,
      commenters: array,
      upVotes: string,
      updatedAt: string
    }),
    currentUser: shape({
      id: any,
      name: string,
      avatarUrl: string
    }),
    fetchPost: func,
    expanded: bool,
    showDetails: func,
    editPost: func,
    showCommunity: bool
  }

  static defaultProps = {
    post: samplePost()
  }

  constructor (props) {
    super(props)
    this.state = {
      imageWidth: null,
      imageHeight: null,
      postWidth: null
    }
  }

  componentDidMount () {
    this.setDimensionsForImage()
  }

  componentDidUpdate (prevProps) {
    const image = get('post.imageUrl', this.props)
    const prevImage = get('post.imageUrl', prevProps)
    if (image !== prevImage) this.setDimensionsForImage()
  }

  setDimensionsForImage () {
    const { post } = this.props
    post.imageUrl && Image.getSize(post.imageUrl, (imageWidth, imageHeight) => {
      this.setState({imageWidth, imageHeight})
    })
  }

  setPostWidth = event => {
    this.setState({postWidth: event.nativeEvent.layout.width})
  }

  render () {
    const {
      post, showDetails, editPost, showCommunity, currentUser
    } = this.props
    const { imageWidth, imageHeight, postWidth } = this.state
    const slug = get('0.slug', post.communities)

    post.imageUrl = SAMPLE_IMAGE_URL

    return <View style={styles.container} onLayout={this.setPostWidth}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        showCommunity={showCommunity}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        id={post.id} />
      <PostImage imageUrl={post.imageUrl}
        {...{postWidth, imageWidth, imageHeight}} />
      <PostBody title={post.title}
        details={post.details}
        linkPreview={post.linkPreview} />
      <PostFooter id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
    </View>
  }
}

export function generateImageDimensions (containerWidth, imageWidth, imageHeight) {
  const width = Math.min(containerWidth, imageWidth)
  let height
  if (width === containerWidth) {
    // image is bigger than available space, maintain aspect ratio
    height = imageHeight / (imageWidth / containerWidth)
  } else {
    // use natural width, use natural height
    // TODO: should there be a max height, and a resizing?
    height = imageHeight
  }
  return {
    width,
    height
  }
}

export const PostImage = ({ imageUrl, imageWidth, imageHeight, postWidth }) => {
  if (!imageUrl) return null
  const imageStyle = generateImageDimensions(postWidth, imageWidth, imageHeight)
  return <Image style={imageStyle} source={{uri: imageUrl}} />
}

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EAEBEB',
    borderRadius: 2,
    backgroundColor: 'white',
    marginLeft: 8, // TODO: remove this, let the wrapper handle this
    marginRight: 8 // TODO: remove this, let the wrapper handle this
  }
}
