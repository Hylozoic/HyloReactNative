/* eslint-disable camelcase */
import React from 'react'
import { View, Image, Text } from 'react-native'
import { parse } from 'url'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import samplePost, { SAMPLE_IMAGE_URL } from './samplePost'
import { get } from 'lodash/fp'
import { decode } from 'ent'
export { PostHeader, PostFooter }

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
      imageWidth: 0,
      imageHeight: 0
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

  render () {
    const {
      post, showDetails, editPost, showCommunity, currentUser
    } = this.props
    const { imageWidth, imageHeight } = this.state
    const slug = get('0.slug', post.communities)

    post.imageUrl = SAMPLE_IMAGE_URL

    return <View style={styles.container}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        showCommunity={showCommunity}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        id={post.id} />
      <PostImage imageUrl={post.imageUrl} {...{imageWidth, imageHeight}} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug} />
      <PostFooter id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
    </View>
  }
}

export const PostImage = ({ imageUrl, imageWidth, imageHeight }) => {
  // TODO: get image sizing correctly
  return null
  if (!imageUrl || !imageWidth || !imageHeight) return null
  return <Image style={styles.postImage} source={{uri: imageUrl}} />
}

// const maxDetailsLength = 144

export const PostBody = ({ id, title, details, imageUrl, linkPreview, slug, expanded, className }) => {
  const decodedTitle = decode(title)

  // TODO: present details with linked mentions and tags

  return <View style={styles.postBody.container}>
    <Text style={styles.postBody.title}>{decodedTitle}</Text>
    <Text style={styles.postBody.details}>{details}</Text>
    {linkPreview && <LinkPreview {...linkPreview} />}
  </View>
}

export const LinkPreview = ({ title, url, imageUrl }) => {
  const domain = parse(url).hostname.replace('www.', '')
  return <View>
    <Image source={{uri: imageUrl}} />
    <Text>{title}</Text>
    <Text>{domain}</Text>
  </View>
}

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EAEBEB',
    borderRadius: 2,
    marginLeft: 8, // TODO: remove this, let the wrapper handle this
    marginRight: 8 // TODO: remove this, let the wrapper handle this
  },
  postImage: {
    flex: 1
  },
  postBody: {
    container: {
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 20
    },
    title: {
      color: '#363D3C',
      fontSize: 19
    },
    details: {
      marginTop: 20,
      color: '#5D757A',
      fontSize: 14
    }
  }
}
