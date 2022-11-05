import HyloWebView from 'components/HyloWebView'

export default function VideoPlayerWebView ({ url }) {
  const path = `/hyloApp/videoPlayer?url=${encodeURIComponent(url)}`

  return (
    <HyloWebView
      path={path}
      mixedContentMode='always'
    />
  )
}
